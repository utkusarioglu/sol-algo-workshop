#!/bin/bash

set -e

TESTS_RELPATH='tests'
UNIT_TEST_FULL_EXTENSION='unit.test.ts'

current_file="$1"

function file_type_accepted_extensions_error {
  full_extension=$1
  cat << EOF
Error: File extension "$full_extension" incompatible with running tests
tests can be initiated from files with extensions \`$UNIT_TEST_FULL_EXTENSION\` or \`.sol\`.
EOF
}

function get_full_extension_filename_check_error {
  cat << EOF
Error: function requires the first param to be the filename
EOF
}

function file_not_available_error {
  filename=$1
  cat << EOF
Error: No corresponding file "$filename" available among tests
EOF
}

function do_checks_first_param_error {
  echo 'Error: First param needs to be the relative path of the test'
}

function get_full_extension {
  filename=$1

  if [ -z "$filename" ]; then
    get_full_extension_filename_check_error
    exit 1
  fi

  echo "${filename#*.}"
}

function do_checks {
  current_file=$1
  full_extension=$(get_full_extension $current_file)
  echo $extension

  if [ -z "$current_file" ]; then
    do_checks_first_param_error
    exit 1
  fi

  if [[ \
    "$full_extension" != "$UNIT_TEST_FULL_EXTENSION" \
    && "$full_extension" != 'sol' \
  ]]; then
    file_type_accepted_extensions_error $full_extension
    exit 2
  fi
}

function resolve_unit_test_file_relpath {
  current_file=$1
  full_extension=$(get_full_extension $current_file)
  
  if [[ "$full_extension" == "$UNIT_TEST_FULL_EXTENSION" ]]; then
    echo "$current_file"
    exit 0
  fi

  file_base_name=$(basename $current_file ".$full_extension")
  unit_test_file_relpath="$TESTS_RELPATH/$file_base_name.$UNIT_TEST_FULL_EXTENSION"

  echo "$unit_test_file_relpath"
}

function main {
  do_checks "$@"
  unit_test_file_relpath=$(resolve_unit_test_file_relpath "$@")
  yarn hardhat test "$unit_test_file_relpath"
}

main "$@"
