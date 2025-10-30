import { AppInput } from "@/components/shared/AppInput";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton, UpdateButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModalLoader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchData } from "@/hooks/use-fetch-data";
import { hasEmptyField, updateField } from "@/lib/helper";
import { CampusService } from "@/services/campus.service";
import { CollegeService } from "@/services/college.service";
import { UserService } from "@/services/user.service";
import { Campus } from "@/types/campus";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

const roles = ['COORDINATOR', 'MEMBER', 'JOB ORDER'];

export function UpdateUser({ toUpdate, setUpdate, setReload }:  {
    toUpdate: Partial<User>
    setUpdate: Dispatch<SetStateAction<Partial<User> | undefined>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const { data: campuses, loading } = useFetchData<Partial<Campus>>(CampusService.getAllCampus);
    const { data: colleges, loading: collegeLoading } = useFetchData<Partial<College>>(CollegeService.getAllColleges);
    console.log(colleges);
    
    const [user, setUser] = useState<Partial<User>>(toUpdate);
    const [onProcess, setProcess] = useState(false);

    useEffect(() => {
        console.log(user);
        
    }, [user])

    async function handleSubmit() {
        try {
            setProcess(true)
            if (hasEmptyField(user, ["middle_name", "is_deleted"])) {
                return toast.warning('PLEASE FILL UP ALL THE FIELDS')
            }
            const {
                campus,
                college,
                highest_educational_attainment,
                created_at,
                updated_at,
                is_deleted,
                ...cleanUser
            } = user;
            const data = await UserService.updateUser(cleanUser);
            if (data) {
                toast.success('User updated successfully.')
                setReload(prev => !prev)
                setUpdate(undefined)
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }

    useEffect(() => {
        if (toUpdate?.college_id || toUpdate?.campus_id) {
            setUser(prev => ({
                ...prev,
                college_id: Number(toUpdate.college_id),
                campus_id: Number(toUpdate.campus_id),
            }));
        }
    }, [toUpdate]);
    
    if (loading || collegeLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setUpdate(undefined) } }>
            <DialogContent className="overflow-y-auto h-9/10">
                <ModalTitle 
                    label="Update"  
                    spanLabel={ `${toUpdate.first_name}?` }
                    spanLabelClassName="text-darkgreen"
                />
                <AppInput
                    label="Email Address"
                    value={ user.email }
                    className="text-gray"
                    onChange={ e => updateField(setUser, 'email', e.target.value) }
                    readonly={true}
                />
                <AppInput
                    label="First Name"
                    value={ user.first_name }
                    onChange={ e => updateField(setUser, 'first_name', e.target.value) }
                />
                <div className="row-md">
                    <AppInput
                        className="w-full"
                        label="Middle Name"
                        placeholder="(optional)"
                        value={ user.middle_name }
                        onChange={ e => updateField(setUser, 'middle_name', e.target.value) }
                    />
                    <AppInput
                        className="w-full"
                        label="Last Name"
                        value={ user.last_name }
                        onChange={ e => updateField(setUser, 'last_name', e.target.value) }
                    />
                </div>
                <div className="stack-sm">
                    <Label>Role</Label>
                    <Select
                        value={ user.role }
                        onValueChange={ (value) => setUser(prev => ({
                            ...prev,
                            role: value
                        }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select campus" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((item, i) => (
                                <SelectItem value={ item } key={i}>{ item }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="stack-sm">
                    <Label>Campus</Label>
                    <Select
                        value={ user.campus_id ? String(user.campus_id) : undefined }
                        onValueChange={ (value) => setUser(prev => ({
                            ...prev,
                            campus_id: Number(value)
                        }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select campus" />
                        </SelectTrigger>
                        <SelectContent>
                            {campuses.map((item, i) => (
                                <SelectItem value={String(item.id)} key={i}>{ item.name }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="stack-sm">
                    <Label>College</Label>
                    <Select
                        value={ user.college_id ? String(user.college_id) : undefined }
                        onValueChange={ (value) => setUser(prev => ({
                            ...prev,
                            college_id: Number(value)
                        }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select college" />
                        </SelectTrigger>
                        <SelectContent>
                            {colleges.map((item, i) => (
                                <SelectItem value={String(item.id)} key={i}>
                                    { item.abbreviations }
                                </SelectItem>
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
                    <UpdateButton
                        type="submit"
                        label="Update User"
                        loadingLabel="Updating User"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}