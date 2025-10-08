import { AppInput } from "@/components/shared/AppInput";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateField } from "@/lib/helper";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { campusesMock } from "../../../public/mock/campuses";
import { AddButton } from "@/components/ui/button";
import { toast } from "sonner";

export function CreateFacultyMember({ setOpen, setReload }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const [user, setUser] = useState<Partial<User>>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        middleName: '',
        lastName: '',
        campusId: 0,
    });
    const [onProcess, setProcess] = useState(false);

    useEffect(() => {
        console.log(user);
        
    }, [user])

    async function handleSubmit() {
        try {
            setProcess(true);
        } catch (error) { toast.error }
    }

    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <ModalTitle label="Create a Faculty Member" />
                <AppInput
                    label="Email Address"
                    value={ user.email }
                    onChange={ e => updateField(setUser, 'email', e.target.value) }
                />
                <div className="row-md">
                    <AppInput
                        className="w-full"
                        label="Password"
                        value={ user.password }
                        onChange={ e => updateField(setUser, 'password', e.target.value) }
                    />
                    <AppInput
                        className="w-full"
                        label="Confirm Password"
                        value={ user.confirmPassword }
                        onChange={ e => updateField(setUser, 'confirmPassword', e.target.value) }
                    />
                </div>
                <AppInput
                    label="First Name"
                    value={ user.firstName }
                    onChange={ e => updateField(setUser, 'firstName', e.target.value) }
                />
                <div className="row-md">
                    <AppInput
                        className="w-full"
                        label="Middle Name"
                        placeholder="(optional)"
                        value={ user.middleName }
                        onChange={ e => updateField(setUser, 'middleName', e.target.value) }
                    />
                    <AppInput
                        className="w-full"
                        label="Last Name"
                        value={ user.lastName }
                        onChange={ e => updateField(setUser, 'lastName', e.target.value) }
                    />
                </div>
                <div className="stack-sm">
                    <Label>Campus</Label>
                    <Select
                        onValueChange={ (value) => setUser(prev => ({
                            ...prev,
                            campusId: Number(value)
                        }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a campus" />
                        </SelectTrigger>
                        <SelectContent>
                            {campusesMock.map((item, i) => (
                                <SelectItem value={String(item.id)} key={i}>{ item.name }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex justify-end gap-4"
                >   
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        label="Creating User"
                        loadingLabel="Creating User"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}