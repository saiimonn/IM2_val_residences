import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import type React from 'react';


interface LeaseFormActionProps {
    onCancel: () => void;
    processing: boolean
}
const LeaseFormAction = ({onCancel, processing}: LeaseFormActionProps) => {
    return (
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
                Cancel
            </Button>
            <Button type="submit" disabled={processing} className="min-w-32">
                {processing ? (
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Creating...
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Create Lease
                    </div>
                )}
            </Button>
        </div>
    )
}

export default LeaseFormAction;
