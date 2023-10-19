@startuml add_payment
!theme cerulean-outline
box "Add Payment Method"
actor "User" as user
participant "disp:Display Manager" as disp
participant "pay:Payment Manager" as pay
actor "Payment System" as paySys
end box
activate user
user -> disp ++ : ADD_PAYMENT
disp --> user : "Card or P2P Payment"
user -> disp : PAYMENT_TYPE
alt CARD_TYPE
  disp --> user : "Enter card detail"
  user -> disp : SUBMIT_CARD
  user -> disp : card_details
  disp -> pay ++ : verify(card_details)
  pay -> paySys --++: verify(card_details) 
  alt success
    paySys --> pay --++ : ACCEPTED
    pay -> pay : add(card_details)
    pay --> disp --: ACCEPTED
    disp --> user : success_message
  else failure
    paySys --> pay --++ : REJECTED
    pay --> disp -- : REJECTED
    disp --> user : "Unknown Card"
  end
else P2P_TYPE
  disp -> paySys: requestPopUp
  paySys --> disp : pop_up_page
  disp -> user : display(pop_up_page)
  alt success
    paySys --> pay --++ : ACCEPTED
    paySys --> pay : p2p_detail
    pay -> pay : add(p2p_detail)
    pay --> disp --: ACCEPTED
    disp --> user : success_message
  else failure
    paySys --> pay --++ : REJECTED
    pay --> disp -- : REJECTED
    disp --> user : "Error Processing"
  end
end
deactivate user
@enduml