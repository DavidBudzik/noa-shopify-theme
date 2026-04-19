#!/bin/sh
exec python3 -m http.server "${PORT:-3002}"
