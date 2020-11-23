---
title: "ABAP - Types and Subroutines"
date: "2016-12-05"
---

https://youtu.be/1-wDkjy3Sek

# Types

[Predefined ABAP Types](https://help.sap.com/doc/saphelp_nw70/7.0.31/en-US/fc/eb2fd9358411d1829f0000e829fbfe/content.htm?no_cache=true)

# Subroutines

[Examples of Subroutines](https://help.sap.com/saphelp_nw70ehp1/helpdata/en/9f/db979035c111d1829f0000e829fbfe/content.htm?no_cache=true)

## Example Report with Subroutines

```
REPORT ZABAP__TRAIN_00_TECH_EX1. DATA: num1 TYPE i, num2 TYPE i, sum TYPE i. num1 = 2. num2 = 4. PERFORM addit USING num1 num2 CHANGING sum. num1 = 7. num2 = 11. PERFORM addit USING num1 num2 CHANGING sum. FORM addit. USING add_sum1 TYPE any add_num2 TYPE any CHANGING TYPE any. add_sum = add_num1 add_num2. PERFORM out USING add_num1 add_num2 add_sum. ENDFORM. FORM out. USING out_num1 TYPE any out_num2 TYPE any out_sum TYPE any. WRITE: / 'Sum of ', out_num1, ' and ', out_sum2, ' is ', out_sum. ENDFORM. 
```
