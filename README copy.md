# pyfuze

[![GitHub](https://img.shields.io/badge/GitHub-5c5c5c)](https://github.com/TanixLu/pyfuze)
[![PyPI - Version](https://img.shields.io/pypi/v/pyfuze)](https://pypi.org/project/pyfuze/)

## Description

pyfuze packages your Python project into one single executable.

This project is primarily built on top of [cosmopolitan](https://github.com/jart/cosmopolitan) and [uv](https://github.com/astral-sh/uv).

## Packaging Modes

| Mode                   | Offline | Cross-Platform | Size       | Compatibility |
|------------------------|------------|----------------|------------|----------------|
| **Bundle** *(default)* | ✅          | ❌             | 🔴 Large   | 🟢 High         |
| **Online**             | ❌          | ✅             | 🟢 Small   | 🟢 High         |
| **Portable**           | ✅          | ✅             | 🟡 Medium  | 🔴 Low          |

**Bundle** mode packages your application with Python and all dependencies included. It only runs on the same platform it was packaged on, providing the highest compatibility. The package extracts its contents to `--unzip-path` at runtime.

**Online** mode produces a smaller, cross-platform package. At runtime, it extracts the package and downloads necessary dependencies to `--unzip-path` (internet connection required). This keeps the package lightweight and adaptable across different systems.

**Portable** mode creates a standalone, cross-platform executable that requires no extraction or internet connection. It supports only pure Python projects and dependencies. This mode is based on [python.com](https://github.com/jart/cosmopolitan/wiki/python.com) from the [cosmos-4.0.2.zip](https://github.com/jart/cosmopolitan/releases/tag/4.0.2) release, currently fixed to Python version 3.12.3.

## Cross-Platform Support

The cross-platform capability of the **online** mode is mainly limited by uv: https://docs.astral.sh/uv/reference/policies/platforms/

The **portable** mode’s cross-platform support depends on the APE specification itself: https://github.com/jart/cosmopolitan/blob/master/ape/specification.md

In summary, both modes are expected to run on macOS (ARM64 and AMD64), Linux (AMD64), and Windows (AMD64).

## Install

```bash
pip install pyfuze
```

Alternatively, you can run it directly with uvx:

```bash
uvx pyfuze -h
```

## Usage

```text
Usage: pyfuze [OPTIONS] PYTHON_PROJECT

  Package Python projects into executables.

Options:
  --mode TEXT                     Available modes:

                                  - bundle(default): Includes Python and all
                                  dependencies. Runs only on the same
                                  platform. Highest compatibility. Extracts to
                                  --unzip-path at runtime.

                                  - online: Small and cross-platform. Extracts
                                  and downloads dependencies to --unzip-path
                                  at runtime (requires internet).

                                  - portable: Standalone cross-platform
                                  executable. No extraction and internet
                                  needed. Supports only pure Python and
                                  --output-name, --entry, --reqs, --include,
                                  --exclude.

  --output-name TEXT              Output executable name [default:
                                  <project_name>.com]
  --entry TEXT                    Entry Python file. Used when your project is
                                  a folder.  [default: main.py]
  --reqs TEXT                     Add requirements.txt file to specify
                                  dependencies (input comma-separated string
                                  OR file path)
  --include TEXT                  Include extra files or folders (e.g.
                                  config.ini) (source[::destination])
                                  (repeatable)
  --exclude TEXT                  Exclude project files or folders (e.g.
                                  build.py) (repeatable).
  --unzip-path TEXT               Unzip path for bundle and online modes
                                  (default: /tmp/<project_name>)
  --python TEXT                   Add .python-version file to specify Python
                                  version (e.g. 3.11)
  --pyproject FILE                Include pyproject.toml to specify project
                                  dependencies
  --uv-lock FILE                  Include uv.lock file to lock dependencies
  --win-gui                       Hide the console window on Windows
  --env TEXT                      Add environment variables such as
                                  INSTALLER_DOWNLOAD_URL,
                                  UV_PYTHON_INSTALL_MIRROR and
                                  UV_DEFAULT_INDEX (key=value) (repeatable)
  --uv-install-script-windows TEXT
                                  UV installation script URI for Windows (URL
                                  or local path)  [default:
                                  https://astral.sh/uv/install.ps1]
  --uv-install-script-unix TEXT   UV installation script URI for Unix (URL or
                                  local path)  [default:
                                  https://astral.sh/uv/install.sh]
  -d, --debug                     Enable debug logging
  -v, --version                   Show the version and exit.
  -h, --help                      Show this message and exit.
```

## Examples

### Portable Mode

Use portable mode to generate a standalone, cross-platform executable.
Best suited for simple scripts like `simple.py`.

```bash
pyfuze ./examples/simple.py --mode portable --reqs requests
```

### Bundle Mode

This command generates `complex.com` in the `dist` folder using the bundle mode.
Since `complex` is a folder-based project, we specify the entry file using `--entry`.

We include `pyproject.toml` and `uv.lock` via `--pyproject` and `--uv-lock` to define the project's dependencies.

By default, `pyfuze` packages all Python files and packages (i.e. folders with `__init__.py`) recursively in the project directory.

The `--include` flag adds extra files like `config.txt`, while `--exclude` skips files such as `build.py`.

The default extraction path is `/tmp/complex`, but here we set it to a local `./complex` directory using `--unzip-path`.
This is useful if you want to preserve files like `config.txt` across reboots, since temporary directories may be cleared.
Alternatively, you can have your Python script copy `config.txt` to a persistent location, such as `%LocalAppData%` on Windows.

Finally, the `--win-gui` option hides the console window on Windows, making it ideal for GUI applications.

```bash
pyfuze ./examples/complex \
  --entry app.py \
  --pyproject ./examples/complex/pyproject.toml \
  --uv-lock ./examples/complex/uv.lock \
  --include ./examples/complex/config.txt \
  --exclude ./examples/complex/build.py \
  --unzip-path complex \
  --win-gui
```

### Online Mode

Use online mode to generate a smaller, cross-platform package.
It requires an internet connection to download Python and dependencies at runtime.

To improve reliability in restricted networks, you can use `--uv-install-script-windows`, `--uv-install-script-unix`, and `--env` to specify mirror URLs.

```bash
pyfuze ./examples/complex \
  --entry app.py \
  --pyproject ./examples/complex/pyproject.toml \
  --uv-lock ./examples/complex/uv.lock \
  --include ./examples/complex/config.txt \
  --exclude ./examples/complex/build.py \
  --unzip-path complex \
  --win-gui \
  --mode online \
  --uv-install-script-windows <uv-windows-installer-mirror-url> \
  --uv-install-script-unix <uv-unix-installer-mirror-url> \
  --env INSTALLER_DOWNLOAD_URL=<uv-binary-mirror-url> \
  --env UV_PYTHON_INSTALL_MIRROR=<python-install-mirror-url> \
  --env UV_DEFAULT_INDEX=<pypi-mirror-url>
```

## Working Directory

The default working directory is `<unzip-path>/src`.

If you want to switch to the directory where the pyfuze executable resides, you can use the `PYFUZE_EXECUTABLE_PATH` environment variable:

```python
import os
os.chdir(os.path.dirname(os.environ["PYFUZE_EXECUTABLE_PATH"]))
```

If you want to switch to the directory where the user invoked the executable, you can use the `PYFUZE_INVOKE_DIR` environment variable:

```python
import os
os.chdir(os.environ["PYFUZE_INVOKE_DIR"])
```

## Note

pyfuze does **NOT** perform any kind of code encryption or obfuscation.

## License

pyfuze is released under the [MIT license](https://github.com/TanixLu/pyfuze/blob/main/LICENSE).

## Contacts

- Report bugs and feature requests via [GitHub Issues](https://github.com/TanixLu/pyfuze/issues)
- Discuss on [Discord](https://discord.gg/GE9FyB5vtt)
- QQ Group: 1054869699
