import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { Separator } from "@/components/ui/separator";
import { useCrudState } from "@/hooks/use-crud-state";
import { formatDateToWord } from "@/lib/helper";
import { Officer } from "@/types/officer";
import { Inbox } from "lucide-react";

export function OfficerList({ items }: {
    items: Officer;
}) {
    const { toDelete, setDelete } = useCrudState<Partial<Officer>>();
    return (
        <div className="bg-slate-50 -mt-2">
            <div className="thead flex-center-y">
                <div className="w-full grid grid-cols-3">
                    <div className="th">Position</div>
                    <div className="th">Name</div>
                    <div className="th">Date Assigned</div>
                </div>
                <div className="th w-10"></div>
            </div>
            <Separator className="h-3 bg-slate-300" />
            {items?.organization.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                    <Inbox className="text-gray w-10 h-10" />
                    <div>No officers found.</div>
                </div>
            )}

            {items?.organization.map((item, i) => (
                <div className="tdata flex-center-y" key={i}>
                    <div className="w-full grid grid-cols-3">
                        <div className="td">{ item.position_name }</div>
                        <div className="td stack-md">
                            { item.assignments.length === 0 && (<div>N/A</div>)}
                            { item.assignments.map((subItem) => (
                                <div key={subItem.id}>{ subItem.name }</div>
                            )) }
                        </div>
                        <div className="td stack-md">
                            { item.assignments.length === 0 && (<div>N/A</div>)}
                            { item.assignments.map((subItem) => (
                                <div key={subItem.id}>{ formatDateToWord(subItem.assigned_date) }</div>
                            )) }
                        </div>
                    </div>
                    <AppRUDSelection 
                        className="mx-auto w-10"
                        item={ item }
                        setDelete={ setDelete }
                    />
                </div>
            ))}
        </div>
    )
}