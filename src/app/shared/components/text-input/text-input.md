# TextInputComponent Documentation

## Overview

The `TextInputComponent` is a reusable Angular component that allows you to create custom input fields with the functionality of material design. It includes options for displaying labels, placeholders, hints, error messages, and input value clearing. Additionally, it supports Angular forms with `FormControl` binding.

## Usage

Import the `TextInputComponent` in your module:

import { TextInputComponent } from "./path-to-your-component/text-input.component";
```

Add TextInputComponent to declarations in your module:
import: [TextInputComponent],

Use in HTML
<app-text-input
[label]="'Username'"
[type]="'text'"
[formControl]="usernameControl"
[placeholder]="'Enter your username'"
[required]="true"
[disabled]="false"
[readonly]="false"
[errorMessage]="'This field is required'"
[hint]="'Minimum 5 characters'"

> </app-text-input>
> Available Inputs
> label:
> Type: string
> Default: ''
> Description: The label text for the input field.
> type:

Type: string
Default: 'text'
Description: Specifies the type of the input field (e.g., 'text', 'email', 'password', etc.).
placeholder:

Type: string
Default: ''
Description: Placeholder text that will appear inside the input field when it's empty.
hint:

Type: string
Default: ''
Description: An optional hint that provides additional context to the user.
formControl:

Type: FormControl
Default: undefined
Description: This attribute binds the input field to an Angular form. It's used for form validation and tracking.
required:

Type: boolean
Default: false
Description: Indicates whether the input field is required. If true, the field will be marked as required in the form.
disabled:

Type: boolean
Default: false
Description: If set to true, the input field will be disabled and the user won't be able to edit the value.
readonly:

Type: boolean
Default: false
Description: If set to true, the input field will be in read-only mode, meaning the user can view but not modify the input.
errorMessage:

Type: string
Default: ''
Description: The error message to display if the input field is invalid (e.g., required field not filled).


