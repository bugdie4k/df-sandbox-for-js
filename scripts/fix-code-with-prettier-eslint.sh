#!/usr/bin/env bash

# Pass the path to the project as the first argument
declare -r PROJ="$1"

# Settings
declare -r PRETTIER_ESLINT="$PROJ/node_modules/.bin/prettier-eslint"
declare -r PRETTIERRC="$PROJ/.prettierrc.json"
declare -r ESLINTRC="$PROJ/.eslintrc.json"
declare -r LOG_LEVEL="warn"
declare -ar GLOB_LIST=(
    # Source
    "$PROJ/src/**/*.js"
    "$PROJ/src/**/*.json"
    # Configs
    "$PROJ/.esdoc.json"
    "$PROJ/.eslintrc.json"
    "$PROJ/.prettierrc.json"
    "$PROJ/package.json"
    "$PROJ/package-lock.json"
)

# Prevents globs from expanding in bash at ${GLOB_LIST[*]}
# Globs are ment to expand in js script
set -o noglob

node $PRETTIER_ESLINT \
--config $PRETTIERRC \
--eslint-config-path $ESLINTRC \
--log-level $LOG_LEVEL \
--write ${GLOB_LIST[*]}
