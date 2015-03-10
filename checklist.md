##Check list

1. All files, methods and functions are commented. Some variable needs information about its legal values, dimensions and units. Do not write useless comments (e.g. writing //increment after `a += 1` ) and immediately remove false/old/useless comments. Make sure that comments are the most visible text in your text editor(Red, bold is good). It will force you to remove false/old/useless comments rather than ignoring it.
2. No magic numbers nor strings. Use Constants instead that are all defined at the beginning.
3. Learn how the stuff you use, works.
4. Do Not repeat yourself. Define everything that is used more than once in a separate function.
5. Write Readable code. Functions should be as simple and as short as possible. To write complex algorithms prefer using some functions with concise names over a long list of basic statement.
6. At the start of a function throw an error if the arguments are invalid. May be overkill for internal function and dialogs.
7. Respect Naming conventions for identifiers. Avoid using shortcuts and avoid acronyms. function and methods should be named for what they do: getX, setX, xFromY, isX, etc
8. Optimize, especially in big loops. There s no need to optimize too early. Optimize your optimization is as important as optimization itself. Define what is important first: memory, cpu or easy to understand ?
9. Declare variables at the beginning and use minimum memory.
10. Write tests for every non trivial function. Getters and setters are trivial.
11. Do not write too much on 1 line. Less than 100 is good, less than 80 is best
12. Separate user interface(print and input) and buissness logic(here we do the math).
13. Indent.
14. Use a linter, do not ignore the warnings. You can write code that is not confusing, not error prone and readable by listening to the warnings of the linter.
(original)[]