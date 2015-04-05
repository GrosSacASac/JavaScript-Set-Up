#Globalization


##Abstract

This specification defines tools, systems and good practices in the globalization process for computer programs. These tools may not exist yet.


##Status of This document

* version: 0.0.2
* English


##Table of Contents

todo:built the table of content
    
##Audience

This text is for software developers, translators or any person involved with a global product.

To understand the entirety of this document, one is can help to know at least two natural language, semantics, basic natural language processing, culture shock, character encoding.


##Introduction

Globalization enables us to make a program available for the world, this is good, the bad parts is that it can take a long time to internationalize a given program. That's why you should handle internationalization from the very beginning with the best practices and tools described in this document.


###Definitions

Definition required to understand this document.


####Interface

An interface is an entry and exit point from program. Programs used by humans often have a graphical user interface or a command line interface. Interfaces made for other programs are often called APIs.


####Internationalize

Separate the concern of the business logic and the interface of a program so that later localization of the program do not require to change the program, but only to extend it.(e.g. adding localization files)


####Localize

Make sure a program is usable by a target group of people who share a common language or culture.


####Globalize

Localize a program for multiple languages or cultures.


###Why ?

I believe that great programs should be available for everyone, no matter their culture or language. It should be easily done. Internationalization should not be harder for non-English speaker. Every programmer should be aware about basic good internationalization practices as much as they are aware about making products that scale.

There are already good solutions outthere for globalization, but not good enough for me.

The superior goal: We can unite people from the globe, to do so we must think before act, do good, do it sustainably, and inspire others. 


###How ?

By recognizing the best tools for globalization or by creating them if they are missing. By explicitly describing the best tools possible we allow the owner of not yet perfect tools to enhance these or other people to create these.


###What ?

This document


###A quick introduction to internationalization


####From worst to good

Here is an example of a simple program, that will evolve so it can be localized easier. Each version comes with good news, then the code and finally new critics one could complain about when localizing or editing this program. Specification of this program: 1 Ask age, 2 inform whether the user is in the age of majority. Python will be used for brevity.


#####Worst

    age = int(input("How old are you ? "))
    if age < 18:
        print("You are not in the age of a majority.")
    else:
        print("You are in the age of a majority.")
    
I have to __browse__ the core source code to edit strings.


#####1.1

No literal magic any more.

    age_of_majority_in_years = 18
    question_age_in_years = "How old are you ? "
    majority_yes = "You are in the age of a majority."
    majority_not = "You are not in the age of a majority."
    
    age = int(input(question_age_in_years))
    if age < age_of_majority_in_years:
        print(majority_not)
    else:
        print(majority_yes)
    
I have to create a copy of the source code for each locale.


#####1.2

Now we have two files. The translator now only has to change locale.py. Now the business logic and the interface are truly separated. The `age_of_majority_in_years` is also moved because it is a cultural variable. 


######localeEn.py

    age_of_majority_in_years = 18
    question_age_in_years = "How old are you ? "
    majority_yes = "You are in the age of a majority."
    majority_not = "You are not in the age of a majority."
    

######main.py

    import localeEn as L
    
    age = int(input(L.question_age_in_years))
    if age < L.age_of_majority_in_years:
        print(L.majority_not)
    else:
        print(L.majority_yes)
    
I can't try the program as long as the localization is not finished. (Assuming the programmer extends the program and uses new text, he will get an undefined error.)


#####1.3

Now we have three files. The program, the locale and the interface between these two. The program now calls a function localize, it returns the wanted string if available, else the string in another locale if available, else the key. It can then be extended to add a todo item in the translators todo lists when the string is not available. Note that since we have an interface we can now decide that the interface reads from a text, json, xml file.


######localeEn.py

    age_of_majority_in_years = 18
    question_age_in_years = "How old are you ? "
    majority_yes = "You are in the age of a majority."
    majority_not = "You are not in the age of a majority."
    

######locales.py

    # exports the localize function
    #function localize(key="") 
    #function localize(key="", dict_1={}) #  for future extension
    

######main.py

    from locales import localize as L
    
    age = int(input(L("question_age_in_years")))
    if age < L("age_of_majority_in_years"):
        print(L("majority_not"))
    else:
        print(L("majority_yes"))
    
localeEn contains almost the same strings multiple times. The translator does not use one of the power code can give: Re-usability !



#####1.4

Now the translator reuses strings. Note that in this example it may seem more complicated, but at least it does scale. And the translator has new powers. This is an upgrade, it does not make translating more complicated, the translator can still write the same as before.

Imagine the program needs the majority sentence with personal pronouns: I, you, he, she, we, they. We could then write 

    `majority = "{"personal pronoun":["I am","You are", "He is", "She is", "We are", "They are"]}{"bool":[" not"]} in the age of a majority."`

The locales.py interface takes care of compiling majority_yes and others to basic strings again.

######localeEn.py
    
    age_of_majority_in_years = 18
    question_age_in_years = "How old are you ? "
    
    majority = "You are{"bool":[" not"]} in the age of a majority."
    
    majority_yes = {"base": "majority", "modifiers":{}}
    majority_not = {"base": "majority", "modifiers":{"bool":0}}
    

######locales.py

    # exports the localize function
    #function localize(key="") 
    #function localize(key="", dict_1={}) #  for future extension
    

######main.py

    from locales import localize as L
    
    age = int(input(L("question_age_in_years")))
    if age < L("age_of_majority_in_years"):
        print(L("majority_not"))
    else:
        print(L("majority_yes"))
    
Looks good right ? But in some culture the majority is not decided by age, so what do we do ? This should be explicitly decided in the specification. The new specification is 1 Ask age, 2 inform whether the user __could__ be in the age of majority. Even further, we ask the age in years, but what if this unit to measure time is different ? What if the majority is modular ( you gain rights and musts continuously) ? That is why the translator must have access to the specification, and must get attention when the specification is not precise enough.


###Golden Rules

The same way, writing tests for a program can ensure long term progressive quality, these golden rules will ensure smooth globalization.

* Abstract away language, region and culture specific details from the main program.
* Translators must have access to a functional specification they understand.
* Translators must have enough context information to do translations without ambiguity.
* Work flow is not blocked by missing localized content.
* For user-input evaluation use appropriate normalization techniques.
* Presentation does not assume text size.
* Normalize everything that comes in and localize everything that comes out.


##External links

* https://www.gnu.org/software/gettext/manual/gettext.html
* http://www.w3.org/standards/webdesign/i18n
* http://www.gala-global.org/why-localize
* http://www.i18nguy.com/
* https://msdn.microsoft.com/en-us/library/cc194756.aspx

###Globalization frameworks