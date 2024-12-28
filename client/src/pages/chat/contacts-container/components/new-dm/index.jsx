import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getcolor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { BACKEND_URL, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";


const NewDm = () => {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [contacts, setContacts] = useState([]);
  const {setSelectedChatType, setSelectedChatData} = useAppStore();
  
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length <= 0) {
        setContacts([]);
        return;
      }

      const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm }, {withCredentials: true});

      if (response.status === 200 && response.data.contacts) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setContacts([]);
  }

  return <>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus className="text-neutral-400 text-sm font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
          onClick={() => setOpenNewContactModel(true)}/>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1e] border-none text-white mb-2 p-3">
          Select new contact
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
      <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Please select a contact?</DialogTitle>
        </DialogHeader>
        <div>
          <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none"
          onChange={e => searchContacts(e.target.value)}/>
        </div>

        {contacts.length > 0 && (
        <ScrollArea className="h-[250px]">
          <div className="flex flex-col gap-5">
            {
              contacts.map((contact) => (
                <div key={contact._id} className="flex gap-3 items-center cursor-pointer"
                onClick={() => selectNewContact(contact)}>
                  <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                      {contact.image ? 
                        <AvatarImage 
                        src={`${BACKEND_URL}/${contact.image}`} 
                        alt="profile"
                        className="object-cover w-full h-full bg-black rounded-full"
                        /> : 
                        <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center ${getcolor(contact.color)}`} style={{borderRadius: "50%"}}>
                        {contact.firstName ? contact.firstName.split("").shift(): contact.email.split("").shift()}
                        </div>} 
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </ScrollArea>
        )}
        {
          contacts.length <= 0 && <div className="flex-1 md:bg-[#1c1d25] md:flex mt-5 md:mt-0 flex-col justify-center items-center duration-1000 transition-all">
          <Lottie
          isClickToPauseDisabled={true}
          height={100}
          width={100}
          options={animationDefaultOptions}
          />
          <div className="text-opacity-80 text-white flex flex-col items-center mt-5 lg:text-2xl text-xl
          transition-all duration--300 text-center">
            <h3 className="poppins-medium">
              Hi<span className="text-purple-500 ">!</span> Search new
              <span className="text-purple-500"> Contact.</span>
            </h3>
          </div>
        </div>
        }
      </DialogContent>
      </Dialog>

  </>
}

export default NewDm;