#Globalization


##Abstract

This specification defines tools, systems and good practices in the globalization process for computer programs. These tools may not exist yet.


##Status of This document

* version: 0.0.3
* draft - work in progress
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

An interface is the entry and exit point. Programs used by humans often have a graphical user interface or a command line interface. Interfaces made for other programs are often called APIs.


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
    #function localize(key="", **details) #  for future extension
    

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

    `majority = "{"personal pronoun":["I am","You are", "He is", "She is", "We are", "They are"]}{'bool':[' not']} in the age of a majority."`

The locales.py interface takes care of compiling majority_yes and others to basic strings again. The majority key-value pair is logically not exported because it is not needed. In Japanese you could not write less with a majority macro the same way because Japanese does not have a one-to-one equivalent to not. A Japanese translator may use raw value-pairs only as seen in `1.3`.

######localeEn.py
    
    age_of_majority_in_years = 18
    question_age_in_years = "How old are you ? "
    
    majority = "You are{'bool':[' not']} in the age of a majority."
    
    majority_yes = {"base": "majority", "modifiers":{}}
    majority_not = {"base": "majority", "modifiers":{"bool":0}}
    

######locales.py

    # exports the localize function    

######main.py

    from locales import localize as L
    
    age = int(input(L("question_age_in_years")))
    if age < L("age_of_majority_in_years"):
        print(L("majority_not"))
    else:
        print(L("majority_yes"))
    
Looks good right ? But in some culture the majority is not decided by age, so what do we do ? This should be explicitly decided in the specification. The new specification is 1 Ask age, 2 inform whether the user __could__ be in the age of majority. Even further, we ask the age in years, but what if this unit to measure time is different ? What if the majority is modular ( you gain rights and musts continuously) ? That is why the translator must have access to the specification, and must have a mean to bring attention when the specification is not precise enough. 

Another problem here, is that keys are legal variable names, this can become a problem when the main developer does not speak English or wants to add more context. Also look at the worst example, it is expressive and we are going to get this expressiveness back.


#####1.5

Now keys are real strings with all their benefits. We use tags with [] in the key to explain that we don't want a translation but something else. We extended localize so that it returns a restricted value when `{"type": "number","default": "18"}` is passed as a second argument.

######localeEn.py

    en = {
        "[number]Age of majority in years" : "18",
        "How old are you ? " : "How old are you ? ",
        
        "majority" : "You are{'bool':[' not']} in the age of a majority.",
        
        "You are in the age of a majority." : {"base": "majority", "modifiers":{}},
        "You are not in the age of a majority." : {"base": "majority", "modifiers":{"bool":0}},
    }
    

######locales.py

    # exports the localize function    

######main.py

    from locales import localize as L
    
    age = int(input(L("How old are you ? ")))
    if age < int(L("[number]Age of majority in years", type="number", default="18")):
        print(L("You are not in the age of a majority."))
    else:
        print(L("You are in the age of a majority."))
    

With all this, the translator has to remember lot of syntax rules. Especially if the translator translates for other programming languages. The translator can accidentally create errors if a comma(,) or double quotes(") are missing without noticing. While it is impossible to remove all rules, it is possible to remove at least some and/or to reuse an existing format that is well documented, with tools checking the validity.

The built-in input function in Python and many other command line interfaces forces the input-text to be to the right from the question. That is why `"How old are you ? "` contains a space at the right. Of course this violate the golden rule about presentation, and causes problems for right-to-left (dir="rtl") languages. To solve this we should use another interface library that can abstract this detail away. This problem is out of scope for this specification. 



#####1.6

JSON format is well suited for data with massive key-value pairs, it is usable by most modern programming languages, supports Unicode and has minimum syntax. Many tools exist to edit JSON, and even more tools exist to check if a JSON file is valid

######localeEn.json

    {
      "[number]Age of majority in years": "18",
      "How old are you ? ": "not",
      "majority": "You are{'bool':[' not']} in the age of a majority.",
      
      "You are in the age of a majority.": {
        "base": "majority",
        "modifiers": {}
      },
      "You are not in the age of a majority.": {
        "base": "majority",
        "modifiers": {
          "bool": 0
        }
      }
    }
    

######locales.py

    # exports the localize function    

######main.py

    from locales import localize as L
    
    age = int(input(L("How old are you ? ")))
    if age < int(L("[number]Age of majority in years", type="number", default="18")):
        print(L("You are not in the age of a majority."))
    else:
        print(L("You are in the age of a majority."))
    




###A quick introduction to localization


####Different formats

It should be clear now why a program should be internationalized before localized. Once a program is internationalized, an extractor program can be run against the source code. This static analysis search the code for certain patterns indicating content that needs to be localized. These contents are copied in a new file as keys with the key-value format. The localization for a target locale is considered finished when all values are specified.

As a translator you should read the specification of the format. These specification are linked at the bottom of this document. Gettext and PIIG (powerful independent internationalization and globalization) examples are shown here, from English to German:

#####Gettext

comments are preceeded by #
the key is left to msgid
the value is left to msgstr

    # comments
    msgid "This sentence must be translated."
    msgstr "Dieser Satz muss übersetzt werden."
    
#####PIIG

comments are in the key in angle brackets ([ ])
the key is before the colon (:)
the value is after the colon
where before is up and left

    {
        "[comments]This sentence must be translated.":
        "Dieser Satz muss übersetzt werden."
    }


####Using the PIIG format

The PIIG format has some very powerful features.


#####Variable injection

Variable injection is used when the programmer want to display a variable inside a localized context. When the program is used, a variable that is only available at that moment will be injected where the placeholders is. `"Hello {}".format(user.name)` in Python can result in `"Hello James"`. Placeholders can have different forms. Here are some examples `%s %d %f` , `{} {xxx} {yyy.zzz}`, `{{xxx}} {{anything}}`, `${this.xxx}`, `_xxx_`.

You must not change the place holder. Copy the place holder, and insert it in the right place. Translate the rest. Example English to German.

    {
        "My name is {}.":
        "Mein Name ist {}."
    }

Another example in English to Japanese.   
 
    {
        "My name is {}.":
        "{} と申します。"
    }

######Multiple variable injection

Multiple variable injection is also possible. Consider a travel guide system with a sentence "Calculating routes for Berlin to Madrid..." The generic sentence would be `"Calculating routes for {origin} to {destination}..."` Note that placeholders must be distinguishable, if they are not, consider talking to the maintainer of the source code, because the program may produce serious bugs for locales where reordering of placeholders is necessary.

    {
        "Calculating routes for {origin} to {destination}...":
        "Berechnen von Routen für {origin} bis {destination}..."
    }

#####Plurals

Consider an email graphical user interface message like "You have 10 new messages in your in-box.". That message is re used multiple times and so the generic string becomes `"You have {message_number} new messages in your {boxname}"` But what happens for 1 ? That' is where the plural mechanism becomes useful. When you see the plural comment you should use the plural mechanism. Except you language has no plural forms.

Before using plurals, there must be a definition of plural in the localization document metadata. The _plural_ metadata needs to be defined only once. its value must be an object
with as key the rules and as values the aliases. In English, there are only two plural forms:1 and not 1. A rule can be a number, an equation, or _other_. Other is selected when no other rules matched, at runtime , with the number supplied.

Once plural rules have been defined, you can use plurals to divide a key in multiple values as possibilities, before writing the possible outcomes, the placeholder that will be replaced by a number must be identified with the key `"_number_"`. Each outcome is a value-pair where the key corresponds to a plural form alias defined in the metadata.

    {
        "_plurals_": {
            "1": "1",
            "_other_": "plural"
        },
        "[plural]You have {message_number} new messages in your {boxname}": {
            "_number_": "{message_number}",
            "1": "You have {message_number} new message in your {boxname}",
            "plural": "You have {message_number} new messages in your {boxname}"
        }
    }


#####Re using sentences, words and blocks


...


####Reading and interpreting comments


#####No comments

Translate the sentence or word.


#####number

Do not translate but instead enter a number, don't use the local numeric system


#####number-local

Do not translate but instead enter a number, use the local numeric system


#####no translate:x,y

Do not translate x and y (often titles, names, representations).


#####Translation, preferences

Unless specified to act differently prefer

* modern over traditional
* generic over dialect specific
* common set over scientific glossary
* 


###Golden Rules

The same way, writing tests for a program can ensure long term progressive quality, these golden rules will ensure smooth globalization.

* Abstract away language, region and culture specific details from the main program.
* Translators must have access to a functional specification they understand.
* Translators must have enough context information to do translations without ambiguity.
* Work flow is not blocked by missing localized content.
* Normalize everything that comes in and localize everything that comes out.
* Presentation does not assume size, alignment or order for localized content.
* Communication between collaborators should be easy.

##External links

###Globalization

* https://www.gnu.org/software/gettext/manual/gettext.html
* http://www.w3.org/standards/webdesign/i18n
* http://www.gala-global.org/why-localize
* http://www.i18nguy.com/
* https://msdn.microsoft.com/en-us/library/cc194756.aspx

###Globalization frameworks

###JSON

http://json.org/
http://www.jsoneditoronline.org/

###Python

https://www.python.org/