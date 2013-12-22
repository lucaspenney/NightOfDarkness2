REM @echo off
del compiled.js
for /r "js/" %%F in (*.js) do type "%%F" >>compiled.js