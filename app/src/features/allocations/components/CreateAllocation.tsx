import { AppHeader } from "@/components/shared/AppHeader";
import { AppInput } from "@/components/shared/AppInput";
import { AppSelect } from "@/components/shared/AppSelect";
import { AppTextarea } from "@/components/shared/AppTextare";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalLoader } from "@/components/ui/loader";
import { useFetchData } from "@/hooks/use-fetch-data";
import { hasEmptyField, updateField } from "@/lib/helper";
import { AllocationService } from "@/services/allocation.service";
import { CampusService } from "@/services/campus.service";
import { CollegeService } from "@/services/college.service";
import { Allocation } from "@/types/allocation";
import { Campus } from "@/types/campus";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

export function CreateAllocation({ claims, setOpen, setReload, defaultCampus, defaultCollege }: {
    claims: Claim
    setOpen: Dispatch<SetStateAction<boolean>>
    setReload: Dispatch<SetStateAction<boolean>>
    defaultCampus: null | number
    defaultCollege: null | number
}) {
    const [onProcess, setProcess] = useState(false)
    const [allocation, setAllocation] = useState<Partial<Allocation>>({
        title: '',
        description: '',
        amount: 0,
        level: defaultCollege === 0 ? "CAMPUS" : defaultCollege !== 0 ? "COLLEGE" : claims.role === "ADMIN" ? "CAMPUS" : "COLLEGE",
        campus_id: defaultCampus && defaultCampus !== 0 ? defaultCampus :claims.role !== "ADMIN" ? claims.campus.id : 1,
        college_id: defaultCollege && defaultCollege !== 0 ? defaultCollege : claims.role !== "ADMIN" ? claims.college.id : null,
    })

    const { data: campuses, loading: campusesLoading } = useFetchData<Campus>(CampusService.getAllCampus, []);
    const { data: colleges, loading: collegesLoading } = useFetchData<College>(CollegeService.getAllColleges, []);

    useEffect(() => {
        if (allocation.level === "CAMPUS") {
            setAllocation(prev => ({
                ...prev,
                college_id: null
            }))
        }
    }, [allocation.level]);

    useEffect(() => {
        console.log(allocation);
    }, [allocation])

    async function handleSubmit() {
        try {
            setProcess(true)
            if (hasEmptyField(allocation, ["college_id"])) {
                return toast.warning('PLEASE FILL UP ALL THE FIELDS')
            }
            const data = await AllocationService.createAllocation(allocation);
            if (data) {
                toast.success('Allocation added successfully.')
                setReload(prev => !prev)
                setOpen(prev => !prev)
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }

    if (campusesLoading || collegesLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="overflow-y-auto max-h-10/11 reveal">
                <ModalTitle label="Add an Allocation" />
                
                <AppInput
                    label="Allocation Title"
                    value={ allocation.title }
                    onChange={ e => updateField(setAllocation, 'title', e.target.value) }
                />
                <AppTextarea
                    label="Description"
                    value={ allocation.description }
                    onChange={ e => updateField(setAllocation, 'description', e.target.value) }
                />
                <AppInput
                    label="Amount"
                    placeholder="in Pihilippine Peso"
                    value={ allocation.amount }
                    type="number"
                    onChange={ e => updateField(setAllocation, 'amount', e.target.value) }
                />
                <AppSelect
                    label="Allocation Level"
                    disabled={ claims.role !== "ADMIN" }
                    items={["CAMPUS", "COLLEGE"]}
                    value={ allocation.level! }
                    groupLabel="Allocation Level"
                    onChange={(value) => setAllocation(prev => ({
                        ...prev,
                        level: value
                    }))}
                />
                <AppSelect
                    label="Campus"
                    disabled={ claims.role !== "ADMIN" }
                    items={campuses.map((item) => ({
                        label: item.name.match(/University\s*-\s*(.+)/i)?.[1] ?? item.name,
                        value: String(item.id)
                    }))}
                    value={ String(allocation.campus_id) }
                    groupLabel="Campuses"
                    onChange={(value) => setAllocation(prev => ({
                        ...prev,
                        campus_id: Number(value)
                    }))}
                />
                <AppSelect
                    label="College"
                    disabled={ allocation.level === "CAMPUS" || claims.role !== "ADMIN" }
                    items={colleges.map((item) => ({
                        label: item.abbreviations,
                        value: String(item.id)
                    }))}
                    placeholder={
                        allocation.level === "CAMPUS"
                            ? "Campus Level ONLY"
                            : "Select College"
                    }
                    value={
                        allocation.level === "CAMPUS"
                            ? ""
                            : String(allocation.college_id || "")
                    }
                    groupLabel="Colleges"
                    onChange={(value) => setAllocation(prev => ({
                        ...prev,
                        college_id: Number(value)
                    }))}
                />
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
                        label="Create Allocation"
                        loadingLabel="Creating Allocation"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}