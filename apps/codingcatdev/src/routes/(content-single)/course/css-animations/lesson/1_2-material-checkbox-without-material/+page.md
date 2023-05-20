---
type: lesson
authors:
  - alex-patterson
cloudinary_convert: false
codepen: 'codercatdev/pen/vYdpGNW'
cover: https://media.codingcat.dev/image/upload/v1681907739/main-codingcatdev-photo/Material-Checkbox.png
excerpt: In this lesson we create a checkbox that transforms into a checkmark just only css.
published: draft
slug: material-checkbox-without-material
start: June 11, 2022
title: Material Checkbox without Material
weight: 2
youtube:
---

The main HTML is very simple, having just two key elements `input` and `span`.

```html
<label>
	<input type="checkbox" />
	<span class="checkbox"></span>
</label>
```

In order to create the checkmark it is nothing more than a bottom, and left border colored green. The key here is that it is then rotated `45deg` to make it look like a check mark.

```css
input:checked ~ .checkbox {
	transform: rotate(45deg);
	height: 125px;
	width: 50px;
	margin-left: 50px;
	border-color: green;
	border-top-color: transparent;
	border-left-color: transparent;
	border-radius: 0;
}
```
