@ECHO OFF
SET APP_HOME=%~dp0
SET WRAPPER_JAR=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar
IF NOT EXIST "%WRAPPER_JAR%" (
  ECHO gradle-wrapper.jar is not present yet.
  ECHO Run this once on a machine with Gradle installed: gradle wrapper
  EXIT /B 1
)
java -classpath "%WRAPPER_JAR%" org.gradle.wrapper.GradleWrapperMain %*
