import { AppInput } from "@/components/shared/AppInput";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModalLoader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchData } from "@/hooks/use-fetch-data";
import { hasEmptyField, updateField } from "@/lib/helper";
import { AuthService } from "@/services/auth.service";
import { CampusService } from "@/services/campus.service";
import { CollegeService } from "@/services/college.service";import { Campus } from "@/types/campus";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

const roles = ['COORDINATOR', 'MEMBER', 'JOB ORDER'];

export function CreateUser({ setOpen, setReload, campusId }:  {
    setOpen: Dispatch<SetStateAction<boolean>>
    setReload: Dispatch<SetStateAction<boolean>>
    campusId?: number
}) {
    const { data: campuses, loading } = useFetchData<Partial<Campus>>(CampusService.getAllCampus);
    const { data: colleges, loading: collegeLoading } = useFetchData<Partial<College>>(CollegeService.getAllColleges);
    
    const [user, setUser] = useState<Partial<User>>({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        sex: '',
        role: 'MEMBER',
        campus_id: campusId ?? 0,
        college_id: 0
    });
    const [onProcess, setProcess] = useState(false);

    async function handleSubmit() {
        try {
            setProcess(true)
            const notRequired: (keyof User)[] = ["middle_name"];
            if (user.role === "COORDINATOR") notRequired.push("college_id");            
            if (hasEmptyField(user, notRequired)) {
                return toast.warning('PLEASE FILL UP ALL THE FIELDS')
            }
            if (user.password !== user.confirmPassword) {
                return toast.warning('password do not matched.')
            }
            const payload = {
                ...user,
                college_id: user.college_id === 0 ? null : user.college_id,
            };
            const data = await AuthService.register(payload);
            if (data) {
                toast.success('User added successfully.')
                setReload(prev => !prev)
                setOpen(prev => !prev)
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }
    
    if (loading || collegeLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="overflow-y-auto h-9/10">
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
                        type="password"
                        value={ user.password }
                        onChange={ e => updateField(setUser, 'password', e.target.value) }
                    />
                    <AppInput
                        className="w-full"
                        label="Confirm Password"
                        type="password"
                        value={ user.confirmPassword }
                        onChange={ e => updateField(setUser, 'confirmPassword', e.target.value) }
                    />
                </div>
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
                <div className="row-md">
                    <div className="stack-sm w-full">
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

                    <div className="stack-sm w-full">
                        <Label>Sex</Label>
                        <Select
                            value={ user.sex }
                            onValueChange={ (value) => setUser(prev => ({
                                ...prev,
                                sex: value
                            }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent>
                                {["Male", "Female"].map((item, i) => (
                                    <SelectItem value={ item } key={i}>{ item }</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="stack-sm">
                    <Label>Campus</Label>
                    <Select
                        value={ String(user.campus_id) }
                        onValueChange={ (value) => setUser(prev => ({
                            ...prev,
                            campus_id: Number(value)
                        }))}
                        disabled={ Boolean(campusId) }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select campus" />
                        </SelectTrigger>
                        <SelectContent>
                            {campuses.map((item, i) => (
                                <SelectItem value={String(item.id)} key={i}>{ item.name?.match(/University\s*-\s*(.+)/i)?.[1] ?? "No campus assigned" }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="stack-sm">
                    <Label>College</Label>
                    <Select
                        onValueChange={ (value) => setUser(prev => ({
                            ...prev,
                            college_id: Number(value)
                        }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select college" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Colleges</SelectItem>
                            {colleges.map((item, i) => (
                                <SelectItem value={String(item.id)} key={i}>
                                    { item.name } ({ item.abbreviations })
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
                    <AddButton
                        type="submit"
                        label="Creat User"
                        loadingLabel="Creating User"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}