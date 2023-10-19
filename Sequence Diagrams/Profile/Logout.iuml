@startuml logout
!theme cerulean-outline
box "Log Out"
actor "User" as user
participant "disp:Display Manager" as disp
participant "sess:Session Manager" as sess
end box
activate user
user -> disp ++ : LOGOUT
disp -> sess ++ : request(LOGOUT)
sess -> sess : remove session ID
sess --> disp : ACCEPTED
disp --> user -- : redirect(LOGIN_SCREEN)
deactivate user
@enduml