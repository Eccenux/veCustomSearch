(scroll down for [English](#english)) 

Polski
------

**veCustomSearch** to plugin do edytora wizualnego (*VisualEditor*) Wikipedii. Umożliwia wstawianie zapamiętanych reguł w polach wyszukiwania i zamiany.

### Domyślne reguły ###

Domyślnie zawiera reguły do:

1. Poprawiania cudzysłowów na polskie.
2. Poprawiania spacji wokół znaków przestankowych (np. "abc , def" zamieni na "abc, def").

Reguły mogą nie być idealne, ale znalezione fragmenty są podświetlane na zielono co powinno ułatwić decyzję, czy wykonać zmiany czy nie.

### Sposób użycia ###

Na razie plugin jest w fazie alfa/beta. Docelowo za pewne będzie w Gadżetach.

* `veCustomSearch.loader.js` -- to przykładowy kod, który należy wstawić do swojego vector.js. Ważne! W przykładowym kodzie należy zmienić odpowiednio URL.
* `veCustomSearch.plugin.js` -- to kod pluginu, który należy wstawić do swojej przestrzeni nazw. Do tego ma prowadzić wspomniany URL.

### Budowanie projektu ###

#### Instalacja webpack ####

Do zbudowania projektu potrzebny jest `webpack`. Można go zainstalować z npm:
```bash
npm install webpack -g
```

Teraz możesz zrobić `checkout` tego repozytorium (a najlepiej jego forka)... 

**...ale w systemie Windows** możesz napotkać na parę drobnych problemów:

1. Folder, w którym będziesz budować, nie może zawierać znaków specjalnych (w szczególności `!`, `(`, `)`).
2. Folder ten nie może być także łączem typu NTFS Junction, czy innym symlinkiem.
3. Musisz mieć ustawioną zmienną środowiskową `NODE_PATH`. Na Windows 7 i nowszych wystarczy odpalić `setx NODE_PATH %AppData%\npm\node_modules`. Może być konieczny restart, żeby wszystkie programy załapały nową zmienną.

#### Budowanie ####

Żeby zbudować wystarczy odpalić jedno polecenie:
```bash
webpack
```
To przetworzy pliki i utworzy nową wersję `veCustomSearch.plugin.js`.

Przy dłuższej pracy warto włączyć śledzenie zmian w plikach:
```bash
webpack --watch
```

English
-------

**veCustomSearch** is a plugin for the VisualEditor of Wikipedia. It allows to restore some search-replace rules in the search form.

### Default rules ###

Default rules are might currently be specific to Polish language, but it should be fairly easy to replace them (they are in `rules.js`).  

### Usage ###

For now I consider this plugin alfa or maybe beta quality.

* `veCustomSearch.loader.js` -- this is an example code which you need to put in your `vector.js`. Note! Example code contains a plugin URL which you need to change appropriately.
* `veCustomSearch.plugin.js` -- this is a pre-compiled code of this plugin. This need to go somewhere in your user namespace. The URL from modified loader snippet need to point to this. 

### Building this project ###

#### The webpack installation ####

You will need `webpack` to build this project. You can install it straight from npm:
```bash
npm install webpack -g
```

Now you can `checkout` this repository (or preferably it's fork)... 

**...but when on Windows** you might stumble upon some quirks:

1. The folder in which you run the build must not contain any special characters (`!`, `(`, `)` in particular).
2. The folder also cannot be an NTFS Junction or any other symlink.
3. Additional `NODE_PATH` variable might be required. On Windows 7 and later you can simply run `setx NODE_PATH %AppData%\npm\node_modules`. A reboot might be required so that all programs see the new environment variable.

#### Running build ####

To build the project you can simply run:
```bash
webpack
```
This will compile all source files into `veCustomSearch.plugin.js`.

When you plan to make more changes you can start a watch process like so:
```bash
webpack --watch
```
