---
title: 継承と委譲の使い分けと、インターフェースのメリット
date: "2018-08-28T00:00Z"
---

継承、委譲、インターフェースは普段特に悩むことなく使い分けができていたのですが、いざ「継承と委譲はどういった基準で使い分けているか？」「インターフェースは何が嬉しいのか？」と聞かれると意外ときちんと言語化できなかったので、この記事に書き起こして言語化を試みました。

## TL;DR

- 子に親と同じ役割が期待される場合、親と同様に振る舞えるようになる継承を使うのが良い
- 子に親と同じ役割が期待されない場合、子にとって親は単なるツールである可能性が高いため委譲を使うのが良い
- インターフェースを使うことで責務の分離を強制することができ、その結果テストの容易性を得られたりする

## 委譲の使いどき

例として、「SQLデータベースからユーザー情報を取り出したり保存したりする機能」を作ろうとしたとき、ぱっと思いつく方針としては、

- DBの接続状態を保持したりSQLクエリを実行したりする部分のロジックは、ユーザー情報の取得に限らず、データベースから情報を取得するとき全般で使いまわせそう  
⇒ DBの操作周辺に関して使いまわせそうな部分はクラスに切り出しておいて(ここでは`Database`クラスとする)、ユーザー情報の取得や保存をするためのクラス`UserDatabse`から`Database`クラスを何らかの方法で利用するようにすれば、`Database`クラスのDB操作機能を使いまわせて良い感じ

という感じになるかと思います。
ここで、`UserDatabase`から`Database`クラスを利用する方法としては、継承または委譲が思い浮かびます。

結論から言うと委譲を使ったほうが良いのですが、継承を使って以下のようにやってしまいたくなるかもしれません。

#### 委譲を使うべき場面で継承を使った例

```java
class Database {
    void connectToDatabase(String dbHost, String dbName, ...){
        // DBへの接続ロジック
    }

    Result doSQL(String sql){
        // 接続しているDBにクエリを投げ、その結果を返すロジック
    }

    // そのほかデータベースの接続状態の管理など
}
```
```java
class UserDatabase extends Database {
    User getUser(int userId) {
        String sql = String.format("SELECT * FROM users WHERE user_id=%d", userId);
        Result result = this.doSQL(sql)
        // クエリの実行結果をもとにユーザーオブジェクトを作って返す
    }
}
```

継承を使ったこの実装だと、`UserDatabase` は`Database`を継承しているので`Database`と同等の振る舞いをできるようになります。  
が、そのことによって不自然な点が生じてしまいます。

`UserDatabase`は、「特定のuserを取得する」という本来持たせたかった役割の他に、`Database`の持つ「DBとの接続状態の保持や、DBへのSQLクエリ送信」といった役割も獲得してしまっています。これは[単一責務の原則](https://xn--97-273ae6a4irb6e2hsoiozc2g4b8082p.com/%E3%82%A8%E3%83%83%E3%82%BB%E3%82%A4/%E5%8D%98%E4%B8%80%E8%B2%AC%E4%BB%BB%E5%8E%9F%E5%89%87/)に反することになります。  
`UserDatabase`の利用側が`UserDatabase`に期待している役割は「特定のオブジェクト(この場合はuser)を取得する」ことであり、直接データベースの操作をしたり、データベースとの接続状態を管理してほしい訳ではないはずです。また`UserDatabase`からすると、`Database`はDB接続のための単なるツールとして使いたいだけで、`Database`自身になりたいわけではありません。  

`UserDatabase`と`Database`のように**期待される役割が異なっている2つのクラス間で継承関係を持つと、上記のような歪みが発生してしまいます。**  
そういう場合は代わりに委譲を使うのが適していると言えます。

#### 委譲を使って書き直した例

`Database`は先程と同じ実装のままで、`UserDatabase`が変更になります。

```java
class UserDatabase {

    Database database;

    UserDatabase(Database database){
        // UserDatabaseのインスタンス生成時にDatabaseのインスタンスをセット
        this.database = database;
    }

    User getUser(int userId) {
        String sql = String.format("SELECT * FROM users WHERE user_id=%d", userId);
        Result result = this.database.doSQL(sql)
        // クエリの実行結果をもとにユーザーオブジェクトを作って返す
    }
}
```

継承はせず、`Database`のインスタンスを保持しておいて、必要に応じてそれを呼び出す(**委譲**)ようになっています。  
`Database`のインスタンスは、`UserDatabase`のオブジェクト生成時のコンストラクタなどで渡すようにします。

`UserDatabase`は`Database`を継承していないので`Database`としては振る舞えず、DBからユーザーを取得するための最小限のロジックのみ知っている状態になっています。  
**「期待される役割が異なっている」クラスの機能を利用したい際は、継承ではなく委譲を用いるのが適切**と言えます。

## 継承の使いどき

逆に「子には親と同じ役割が期待される」場合には継承が適しています。

たとえば、`Car`(車)クラスと`ElectoricCar`(電気自動車)クラスを考えます。
`Car`のほうが`ElectoricCar`よりも意味が広く抽象度は高いですが、`Car`を利用するときも`ElectoricCar`を利用するときも「加速する/減速する」「窓を開ける/閉める」といった基本的な動作は共通して可能であることが期待されます。  
「ハイブリッドカーを運転する」ことを、「車を運転する」と言い換えても間違いではないように、`Car`と`ElectoricCar`に期待される役割は基本的な部分では一緒であると言えます。

このような場合に委譲を使うと以下のようになります。

#### 継承を使うべき場面で委譲を使った例

```java
class Car {
    void SpeedUp(){
        // ...
    }

    void OpenWindow(){
        // ...
    }

    // ...
}
```
```java
class ElectoricCar {
    Car car;

    void SpeedUp(){
        car.SpeedUp();
    }

    void OpenWindow(){
        car.OpenWindow();
    }

    // ...

    // 電気自動車特有のロジック
    void Charge() {
        // ...
    }
}
```

加速や減速、窓の開閉など、`Car`の持っている機能の数だけ`ElectoricCar`にボイラープレートコードが増えていきます。`Car`に「ライトを点ける」動作が増えた場合には`ElectoricCar`にも変更を加えなくてはいけません。新たに`HybridCar`を増やそうとすると更に辛くなっていきます。
また、2つのクラスは継承関係に無いので、ダックタイピングを許さないような言語だと`ElectoricCar`を`Car`として扱うこともできません。

#### 継承を使って書き直した例

`Car`は先程と同じ実装のままで、`ElectoricCar`が変更になります。

```java
class ElectoricCar extends Car {
    void Charge() {
        // ...
    }
}
```

委譲を使った際と比べて圧倒的にスッキリします。`Car`に新たなメソッドが増えるなどの変更が入っても`ElectoricCar`に変更を入れる必要はありません。**「子には親と同じ役割が期待される」場合は、委譲ではなく継承を用いるのが適切**と言えます。

## ここまでのまとめ

- 子に親と同じ役割が期待される場合、親と同様に振る舞えるようになる継承を使うのが良い
- 子に親と同じ役割が期待されない場合、子にとって親は単なるツールである可能性が高いため委譲を使うのが良い

## インターフェースの使いどころ

`UserDatabase`について再び考えると、極端な話`UserDatabase`の利用側は、userさえ取得できればそれで良くて、その裏側にあるのがデータベースだろうが、`.txt`ファイルに保存されていようが、オンメモリだろうがなんだって良いはずです。
こういう「裏の実装は複雑な状態などを取りうるかもしれないが、使う側としては目的が達成できれば何でもいい」場合はインターフェースの出番であることが多いです。  
そこで、`UserRepository`という「ユーザーを取得・保存する」役割のインターフェースを作り、`UserDatabase`が`UserRepository`を実装するようにしてみます。

```java
interface UserRepository{
    User getUser(int userId);
    void saveUser(User user);
}
```
```java
class UserDatabase implements UserRepository{

    Database database;

    UserDatabase(Database database){
        this.database = database;
    }

    User getUser(int userId) {
        String sql = String.format("SELECT * FROM users WHERE user_id=%d", userId);
        // ...
    }

    // ...
}
```

`UserRepository`の利用側のロジックは例えば以下のようになります。  

```java
class SomeApplicationService {
    UserRepository userRepository;

    void changeUserEmail(String email){
        User user = userRepository.getUser(userId);
        user.setEmail(email);
        userRepository.saveUser(user);
    }
}
```

`UserRepository`はインターフェースのため、実装に関して全く言及をしていません。そのため、**`UserRepository`を利用している`SomeApplicationService`側としては、「とにかくuserが取得できることを期待しており、実装は何でも良い」ということをコードで表明している**ことになります。  
結果、以下のようなメリットを得られるようになります。
- ユーザーデータのハンドリングが主な役割である`SomeApplicationService`がデータベースへの接続などについて言及することはなくなり(できなくなり)、責務の分離を強制することができます。  
- `SomeApplicationService`はDBについては言及していないので、例えば`SomeApplicationService`のテスト用に`UserRepository`を実装したインメモリの`InMemoryUserDatabase`を用意しておいて、テストのときだけ`userRepository`の実装を差し替えるようなことが可能となり、よりテストが容易になります。

