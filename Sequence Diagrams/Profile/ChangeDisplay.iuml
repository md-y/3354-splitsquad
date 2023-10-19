@startuml change_display
!theme cerulean-outline
box "Change Display"
actor "User" as user
participant "disp:Display Manager" as disp
end box
activate user
user -> disp ++ : CHANGE_DISPLAY
disp --> user : "Dark/Light Mode"
user -> disp : CHOOSE_DISPLAY
user -> disp : display_mode
disp -> disp : set(display_mode)
deactivate user
@enduml