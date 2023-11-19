# MealCost
![alt text](https://github.com/Wassim-kooki/MealCost/blob/main/Screenshot%20from%202023-11-19%2006-58-51.png?raw=true "Main Screenshot")
This is an application for restaurants to manage the costs of meals. It allows to add items and edit them, and it will automatically edit all related items. In this app, the user can add subcategories within three main categories, which are:
### 1. Raw Materials
Such as sugar, salt, limon, oil, and many other.
### 2. Semi-finished Materials
These materials are made in the restaurant as a part of meals or a part of each other, they contain raw materials and semi-finished materials. Such as mayonnaise, spice mix (blends), salata, and many other.
### 3. Finished Meals
Here are the finished meals, which contain of raw materials and semi-finished materials.

## Materials Units
The user can input the cost of materials for one Kg (Kilogram), g (Gram), L (Liter), mL (Milliliter), piece. When adding materials to semi-finished materials or finished meals, the units have to be specified for entered quantities, and except for finished meals, at the end, the quantity of the material after preparing have to be specified, so that the application will show its cost for one unit in main view.

# Run & package
this application is written in JavaScript using electron framework, and HTML and CSS are used also. At first make sure the NodeJS is installed
### 1. Install Dependencies
First of all, install dependencies by running the following command in terminal of CMD at the project folder:
```
npm install
```
### 2. Run
to run the app:
```
npm run start
```
### 3. Package
It's possible to package the application by editing the "package.json":
```
{
  ...
  "scripts": {
    ...
    "package": ... --platform=<platform> --arch=<arch> ...
  }
  ...
}
```
change "`<platform>`" and "`<arch>`" according to the target as following:
| target | `<platform>` | `<arch>` |
| --- | --- | --- |
| Windows | win32 | ia32, x64 or arm64 |
| macOS | darwin | x64, arm64 or universal |
| Mac App Store | mas | x64, arm64 or universal |
| Linux | linux | ia32, x64, armv7l, arm64 or mips64el |

After editing the file, run the following:
```
npm run package
```
A new folder will be created including the target package.
