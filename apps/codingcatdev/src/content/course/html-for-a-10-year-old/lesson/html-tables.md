---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1620240196/main-codingcatdev-photo/s58bcshsqx9pdio6q0k5.png
excerpt: HTML for a 10 Year Old Tables
published: published
slug: html-tables
start: June 1, 2022
title: HTML Tables
weight: 2
---
## Full Table Example

Below is an example of the entire table, we will walk through each part and how to create this table.

- `<table>` Defines a table
- `<th>` Defines a header cell in a table
- `<tr>` Defines a row in a table
- `<td>` Defines a cell in a table
- `<caption>` Defines a table caption
- `<colgroup>` Specifies a group of one or more columns in a table for formatting
- `<col>` Specifies column properties for each column within a `<colgroup>` element
- `<thead>` Groups the header content in a table
- `<tbody>` Groups the body content in a table
- `<tfoot>` Groups the footer content in a table

> Please note if you are new to web development do not use tables for laying out pages. This was something that happened 20 years ago but we have come a long way since then 😉
> 

<iframe src="[https://codesandbox.io/embed/html-for-a-10-year-old-table-complete-wif2m?fontsize=14&hidenavigation=1&theme=dark&view=preview](https://codesandbox.io/embed/html-for-a-10-year-old-table-complete-wif2m?fontsize=14&hidenavigation=1&theme=dark&view=preview)"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="html-for-a-10-year-old-table-complete"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />

### Basic Tables

In the most basic example of a table you only need the `<table>`, `<tr>`, `<td>` tags. In this example you have a table with a single row (horizontal) and 6 columns (vertical), to show our peeps in a 1×6 configuration.

```html
<table>
  <tr>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
  </tr>
</table>

```

If we want a basic table to show our peeps in one column (vertical) with six rows (horizontal) you need to add a `<tr>` to surround each `<td>`, to show a 6×1 configuration

```html
<table>
  <tr>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
  </tr>
</table>

```

Finally if we need a table with all six columns (vertical) and all six rows (horizontal) it would need to include six `<td>` tags inside of six `<tr>` tags.

```html
<table>
  <tr>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
  </tr>
  <tr>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
    <td>????</td>
  </tr>
</table>

```

Because we are using every cell in the table examples above it makes setting them up very easy. There could be times when you have empty cells requirements. Now you might think that would be easy if you just need two blank cells you remove two of the `<td>` tags. However, the issue is that the browser moves every column to the left (or right if you are in RTL), causing you to actually leave a blank, therefore you need to put in an empty `<td></td>` element to take up a column worth of space with nothing in it.

```html
    <table>
      <tr>
        <td></td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
      </tr>
      <tr>
        <td>????</td>
        <td></td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
      </tr>
      <tr>
        <td>????</td>
        <td>????</td>
        <td></td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
      </tr>
      <tr>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td></td>
        <td>????</td>
        <td>????</td>
      </tr>
      <tr>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td></td>
        <td>????</td>
      </tr>
      <tr>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td>????</td>
        <td></td>
      </tr>
    </table>

```

## Live Basic Examples

<iframe src="[https://codesandbox.io/embed/html-for-a-10-year-old-table-1-wqev6?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/html-for-a-10-year-old-table-1-wqev6?fontsize=14&hidenavigation=1&theme=dark)"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="html-for-a-10-year-old-table-1"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />

### The Header

When you see tables in action you often have data that needs to be labeled. The best way to make this happen is by adding a `<thead>` element to your table and adding header cells `<th>` to the element to help in labeling this data.

```html
<table>
  <thead>
    <tr>
      <!-- Normal Header Cell -->
      <th>Name</th>
      <!-- Column Span Header Cell -->
      <th>Purrfect Peeps</th>
    </tr>
  </thead>
  <tbody>
    <!-- Row 1 -->
    <tr>
      <!-- Normal Cells -->
      <td>Nick</td>
      <td>????</td>
    </tr>
    <!-- Row 2 -->
    <tr>
      <!-- Normal Cell -->
      <td>AJ</td>
      <td>????</td>
      <td>????</td>
      <td>????</td>
      <td>????</td>
      <td>????</td>
      <td>????</td>
    </tr>
  </tbody>
</table>

```

Now this simple table setup will work great with a single cell for each column in the first row. But if we add the next row and it has 6 purrfect peeps, we really want to show that the header cell “Purrfect Peeps” is meant for all cells that have emojis.Below you can see the difference between the top table without colspan and with colspan in the second table. Without the colspan the “Purrfect Peeps” cell is taken up by only the cat in the second row, and it does not cover the dog, unicorn, bear, zebra, or otter. In the second table we use “colspan” `<th colspan="6">Purrfect Peeps</th>` to tell the browser that this header should span all 6 columns, notice how all the cells center under the heading.

<iframe src="[https://codesandbox.io/embed/html-for-a-10-year-old-table-columnspan-jdp9q?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/html-for-a-10-year-old-table-columnspan-jdp9q?fontsize=14&hidenavigation=1&theme=dark)"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="html-for-a-10-year-old-table-columnspan"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />

### Nested Table

There is a great deal of power that you can add to your tables by nesting an entire table into a cell. I often forget to wrap this with a `<table>` tag so please don’t just try to add rows `<tr>` within a `<td>` tag and think this will work, it needs to be represented by an entire table. As you can see below we have added social links as an entire table within a cell.

```html
 <!-- Nested Table Inside of cell -->
  <td>
    <table>
      <tr>
        <td>
          <a href="<https://link.ajonp.com/twitter>">Twitter</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="<https://link.ajonp.com/linkedin>">LinkedIn</a>
        </td>
      </tr>
    </table>
  </td>

```

Below you can start to see that the parent header row “Socials” still represents all data in the cell, even the nested table in the second row with a 4×4 table.

<iframe src="[https://codesandbox.io/embed/html-for-a-10-year-old-table-colgroup-wlspl?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/html-for-a-10-year-old-table-colgroup-wlspl?fontsize=14&hidenavigation=1&theme=dark)"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="html-for-a-10-year-old-table-colgroup"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />

### Column Group

The column group tag `<colgroup>` can be used for styling entire columns at a time, instead of having to update each cell individually. Something that you will often see is a single column highlighted. This provides a valuable tool that is a common use case for highlighting an entire column. By this simple code snippet we can highlight the socials to include a background of pink.

```html
  <colgroup>
    <col />
    <col style="background-color:pink" />
  </colgroup>

```

### Footer

A very common use case for a footer and the reason for calling it out separately is to include Totals or Aggregations (fancy math like word for adding stuff). In this example we just add some text with fun phrase.

```html
      <tfoot style="background-color:purple; color: white;">
        <tr>
          <td colspan="8">
            AJ's Peep List! This is an example of a unique footer area.
          </td>
        </tr>
      </tfoot>

```

<iframe src="[https://codesandbox.io/embed/html-for-a-10-year-old-table-footer-npnt7?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/html-for-a-10-year-old-table-footer-npnt7?fontsize=14&hidenavigation=1&theme=dark)"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="html-for-a-10-year-old-table-footer"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />

> Pro Tip: by keeping a seperate header and footer tag it allows large table body content to be easily scrolled while the header and footer maintain in place.
> 

### Caption

> By default, a table caption will be center-aligned above a table. However, the CSS properties text-align and caption-side can be used to align and place the caption. -W3 Schools
> 

I find myself using caption less and less over other methods, but I thought it would be a nice complete example. Adding the below snippet with an attribute text-align=”bottom” will place example text below our table. This could explain some of the figures or label your table.

```html
      <caption align="bottom">
        This is an example caption for our table.
      </caption>
```

<iframe src="[https://codesandbox.io/embed/html-for-a-10-year-old-table-caption-w1qql?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/html-for-a-10-year-old-table-caption-w1qql?fontsize=14&hidenavigation=1&theme=dark)"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="html-for-a-10-year-old-table-caption"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />