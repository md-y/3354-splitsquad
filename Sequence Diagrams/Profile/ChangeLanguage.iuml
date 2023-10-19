@startuml change_language
!theme cerulean-outline
box "Change Language"
actor "User" as user
participant "disp:Display Manager" as disp
participant "lang:Language Manager" as lang
end box
activate user
user -> disp ++ : CHANGE_LANGUAGE
disp -> lang ++ : retrieve_list()
lang --> disp : language_list
disp --> user : display(language_list)
user -> disp : CHOOSE_LANGUAGE
user -> disp : language
disp -> disp : set(language)
loop 
  disp -> lang : translate(current_page, language)
  lang --> disp : translated_page
  disp --> user : display(translated_page)
end
deactivate user
@enduml