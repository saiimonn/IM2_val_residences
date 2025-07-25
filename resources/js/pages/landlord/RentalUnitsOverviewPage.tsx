import { PropertiesDataTable } from '@/components/landlord/Properties/propertiesTable/properties-data-table';
import { propertyColumns, type Unit } from '@/components/landlord/Properties/propertiesTable/propertiesColumn';
import LandlordPageHeaderSection from '@/components/landlord/ui/LandlordPageHeaderSection';
import { Button } from '@/components/ui/button';
import LandlordLayout from '@/layout/LandlordLayout';
import { Building2, CheckSquare, Plus, Users, Wrench } from 'lucide-react';
import { Link } from '@inertiajs/react';


interface PropertiesOverviewPageProps {
    unitsTableData: Unit[],
    numberOfUnits: number,
    availableUnits: number,
    numberOfOccupiedUnits: number,
    numberOfMaintenanceRequests: number
}

const RentalUnitsOverviewPage = ({unitsTableData, numberOfUnits, availableUnits, numberOfOccupiedUnits, numberOfMaintenanceRequests}: PropertiesOverviewPageProps) => {

    const metricsData = [
        {
            title: 'Total Units',
            metric: numberOfUnits,
            metricDescription: 'Total number of units',
            icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: 'Available',
            metric: availableUnits,
            metricDescription: 'Number of available units',
            icon: <CheckSquare className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: 'Occupied',
            metric: numberOfOccupiedUnits,
            metricDescription: 'Number of occupied units',
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
        },
        {
            title: 'Maintenance',
            metric: numberOfMaintenanceRequests,
            metricDescription: 'Number of maintenance requests',
            icon: <Wrench className="h-4 w-4 text-muted-foreground" />,
        },
    ];


    const landlordOptions = [
        { label: 'John Smith', value: 'landlord-1' },
        { label: 'Sarah Johnson', value: 'landlord-2' },
    ];

    const propertyTypeOptions = [
        { label: 'Duplex', value: 'duplex' },
        { label: 'Triplex', value: 'triplex' },
        { label: 'Loft', value: 'loft'},
        { label: 'Studio', value: 'studio'},
    ];

    return (
        <LandlordLayout>
            <div className="w-full space-y-6">
                {/* Header Section*/}
                <LandlordPageHeaderSection
                    title={'Properties'}
                    subtitle={'Manage and monitor all your rental units'}
                    metric={metricsData}
                    action={
                        <Button size="sm" asChild>
                            <Link href="/landlord/properties/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Property
                            </Link>
                        </Button>
                    }
                />

                <div className="flex-col items-start gap-2 self-stretch">
                    <PropertiesDataTable
                        columns={propertyColumns}
                        data={unitsTableData}
                        landlords={landlordOptions}
                        propertyTypes={propertyTypeOptions}
                    />
                </div>
            </div>
        </LandlordLayout>
    );
};

export default RentalUnitsOverviewPage;
