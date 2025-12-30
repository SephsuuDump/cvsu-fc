import { AppInput } from "@/components/shared/AppInput";
import { AppSelect } from "@/components/shared/AppSelect";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { ModalLoader } from "@/components/ui/loader";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { useToday } from "@/hooks/use-today";
import { hasEmptyField } from "@/lib/helper";
import { CampusService } from "@/services/campus.service";
import { OfficerService, PositionService } from "@/services/officer.service";
import { UserService } from "@/services/user.service";
import { Campus } from "@/types/campus";
import { Officer, Position } from "@/types/officer";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

export function CreateOfficer({ setOpen, setReload }: {
    setOpen: (i: boolean) => void;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const { isoDate } = useToday();
    const [comfirm, setConfirm] = useState(false);
    const [isUniquePosition, setIsUniquePosition] = useState(false);
    const [onProcess, setProcess] = useState(false);
    const [finalUsers, setFinalUsers] = useState<User[]>([]);
    const [officer, setOfficer] = useState<Partial<Officer>>({
        user_id: 0,
        position_id: 0,
        campus_id: 0,
        assigned_date: isoDate
    })

    const { data: users, loading: usersLoading } = useFetchData<User>(
        UserService.getAllUsers
    )

    const { data: positions, loading: positionsLoading } = useFetchData<Position>(
        PositionService.getAllPositions
    )

    const { data: campuses, loading: campusesLoading } = useFetchData<Campus>(
        CampusService.getAllCampus
    )

    useEffect(() => {
        if (!users || users.length === 0) return;

        if (officer.campus_id === 0) {
            setFinalUsers(users);
        } else {
            setFinalUsers(
                users.filter(u => u.campus.id === officer.campus_id)
            );
        }
    }, [users, officer.campus_id]);

    const { search: userSearch, setSearch: setUserSearch, filteredItems: filteredUsers } = useSearchFilter(finalUsers, ["first_name", "last_name"])
    const { search: positionSeach, setSearch: setPositionSearch, filteredItems: filteredPositions } = useSearchFilter(positions, ["position"])
    const { search: campusSearch, setSearch: setCampusSearch, filteredItems: filteredCampus } = useSearchFilter(campuses, ["name"])

    async function handleSubmit() {
        try {
            setProcess(true);
            if (hasEmptyField(officer)) return toast.error('Please fill up all fields')
                const data = await OfficerService.createOfficer(officer);
            if (data) {
                toast.success('Officer assigned successfully.')
                setReload(prev => !prev)
                setOpen(false)
            }
        } catch (error) {
            toast.error(`${error}`)
        } finally { setProcess(false) }
    }

    if (usersLoading || positionsLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <div>

                </div>
                <ModalTitle label="Assign an Officer" />
                <div className="flex flex-col gap-2">
                    <AppSelect 
                        label="Campus"
                        groupLabel="CvSU Campuses"
                        items={ filteredCampus.map((item) => ({
                            label: item.name.match(/University\s*-\s*(.+)/i)?.[1] ?? item.name,
                            value: String(item.id)
                        })) }
                        placeholder="Select campus"
                        onChange={ (value) => setOfficer((prev) => ({
                            ...prev,
                            campus_id: Number(value)
                        })) }
                        searchPlaceholder="Search for a campus"
                        search={ campusSearch }
                        setSearch={ setCampusSearch }
                    />

                    <AppSelect 
                        label="Position"
                        groupLabel="Positions"
                        items={ filteredPositions.map((item) => ({
                            label: item.position,
                            value: String(item.id)
                        })) }
                        placeholder="Select position"
                        onChange={ (value) =>  {
                            setOfficer((prev) => ({
                                ...prev,
                                position_id: Number(value)
                            }
                            // setIsUniquePosition(positions.find(i => i.is))
                        )) }}
                        searchPlaceholder="Search for a position"
                        search={ positionSeach }
                        setSearch={ setPositionSearch }
                    />

                    <AppSelect 
                        label="Faculty Member"
                        groupLabel="Faculty Members"
                        items={ filteredUsers.map((item) => ({
                            label: item.first_name + " " + item.last_name,
                            value: String(item.id)
                        })) }
                        placeholder="Select faculty member"
                        onChange={ (value) => setOfficer((prev) => ({
                            ...prev,
                            user_id: Number(value)
                        })) }
                        searchPlaceholder="Search for faculty member"
                        search={ userSearch }
                        setSearch={ setUserSearch }
                        disabled={ officer.campus_id === 0 }
                    />
                    
                </div>
                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex justify-end gap-4 mt-2"
                >   
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        label="Assign Officer"
                        loadingLabel="Assigning Officer"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}