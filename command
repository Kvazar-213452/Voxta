mvn clean install
mvn archetype:generate -DgroupId=com.example -DartifactId=myproject -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

mvn compile
mvn exec:java -Dexec.mainClass="com.example.App"
mvn package
java -jar target/myproject-1.0-SNAPSHOT.jar

java -jar target/webview-project-1.0-SNAPSHOT.jar

java --module-path "lib/javafx-sdk-17.0.14/lib" --add-modules javafx.controls,javafx.web -jar target/webview-project-1.0-SNAPSHOT.jar

mvn javafx:run
