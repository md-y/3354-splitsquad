@startuml change_notif
!theme cerulean-outline
box "Change Notification"
actor "User" as user
participant "disp:Display Manager" as disp
participant "notif:Notification Manager" as notif
end box
activate user
user -> disp ++ : CHANGE_NOTIF
disp -> notif ++ : retrieve_list()
notif --> disp : notif_setting_list
disp --> user : display(notif_setting_list)
user -> disp : SUBMIT_SETTING
user -> disp : new_settings
disp -> notif : set(new_settings)
deactivate user
@enduml