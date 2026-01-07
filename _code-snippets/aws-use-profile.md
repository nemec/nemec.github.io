---
layout: snippet
title: Easily switch between AWS profiles in the CLI
description: bash scripts to switch between profiles in the CLI and support putting your current AWS profile in your terminal prompt
tags:
  - bash
  - aws
language: bash
variables:
  $FILENAME:
    #type: date # https://www.w3schools.com/html/html_form_input_types.asp
    replace: $FILENAME
    #attrs:
    #  min: '2020-08-01'
---

```bash
# Extract the profile names from your config file
list-aws-profiles() {
    if [[ -f ~/.aws/config ]]; then
        grep "\[profile " ~/.aws/config | sed -r 's/\[profile (.+)]/\1/'
    fi
}

use-aws-profile() {
    current_profile="$AWS_PROFILE"
    new_profile="$1"
    if [[ -z "$new_profile" ]]; then
        echo "usage '$0 <profile>' to set profile or '$0 -' to remove profile and access keys" >&2
        return 1
    fi
    if [[ "-" == "$new_profile" ]]; then
        echo "Removing AWS profile $current_profile" >&2
        unset AWS_PROFILE
        unset AWS_ACCESS_KEY_ID
        unset AWS_SECRET_ACCESS_KEY
        unset AWS_SESSION_TOKEN
        return
    fi
    available_profiles=$(list-aws-profiles)
    if [[ "$available_profiles" != *"$new_profile"* ]]; then
        echo "$new_profile not found in ~/.aws/config" >&2
    fi
    if [[ -z "$current_profile" ]]; then
        export AWS_PROFILE="$new_profile"
        echo "Setting AWS profile to '$new_profile'" >&2
    elif [[ "$current_profile" != "$new_profile" ]]; then
        export AWS_PROFILE="$new_profile"
        echo "Switching AWS profile from '$current_profile' to '$new_profile'" >&2
    fi
}
```

If you want to put your current AWS profile in your shell prompt:

```bash
get_aws_profile_for_ps1() {
    if [[ -z "$AWS_ACCESS_KEY_ID" ]]; then
        if [[ -z "$AWS_PROFILE" ]]; then
            return 0;
        fi
        echo -n "$AWS_PROFILE"
    else
        echo -n "$AWS_ACCESS_KEY_ID"
    fi
}

# Then you can set your prompt like
function prompt_command {
  local AP="$(get_aws_profile_for_ps1)"
  if [[ -n "$AP" ]]; then
      # add spacing and brackets if profile is set
      AP=" [${AP}]"
  fi
  export PS1="\h${AP}\$ "
}
export PROMPT_COMMAND=prompt_command
```