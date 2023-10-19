@startuml remove_payment
!theme cerulean-outline
box "Remove Payment Method"
actor "User" as user
participant "disp:Display Manager" as disp
participant "pay:Payment Manager" as pay
end box
activate user
user -> disp ++ : REMOVE_PAYMENT
disp -> pay ++ : retrive_list()
disp --> user : display(payment_list)
user -> disp : CHOOSE_PAYMENT
user -> disp : payment_index
disp -> pay : remove(payment_index)
deactivate user
@enduml