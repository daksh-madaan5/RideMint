import { useState } from 'react';
import {
  HiArrowRight,
  HiBookmark,
  HiOutlineArchiveBox,
  HiOutlineExclamationCircle,
  HiOutlineMagnifyingGlass,
  HiPlus,
  HiXMark,
} from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Radio from '@/components/ui/Radio';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import { toast } from 'react-toastify';

const swatches = [
  ['Background', '--background'],
  ['Surface', '--surface'],
  ['Subtle surface', '--surface-subtle'],
  ['Primary', '--primary'],
  ['Navigation', '--navigation'],
  ['Success', '--success'],
  ['Warning', '--warning'],
  ['Danger', '--danger'],
];

const sectionClass = 'border-t border-[var(--border)] pt-10';

export default function DesignSystem() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 sm:py-16">
      <div className="page-container space-y-12">
        <PageHeader
          eyebrow="Internal route · Phase 1"
          title="RideMint design system"
          description="Editorial Automotive foundations for a balanced customer interface and compact operational tools. This route uses static examples and does not fetch feature data."
          actions={<Button variant="outline" onClick={() => window.location.assign('/')}>Return to app</Button>}
        />

        <section>
          <SectionHeader title="Colour tokens" description="Semantic names keep product intent separate from individual colour values." />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {swatches.map(([label, token]) => (
              <div key={token}>
                <div className="aspect-square rounded-[var(--radius-card)] border border-[var(--border)]" style={{ background: `var(${token})` }} />
                <p className="type-label mt-2">{label}</p>
                <p className="type-caption mt-0.5">{token}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <SectionHeader title="Typography" description="Space Grotesk is reserved for headings; Inter carries interface and reading text." />
          <div className="mt-6 space-y-6">
            <p className="type-display max-w-4xl">Find a car for your trip.</p>
            <p className="type-page-heading">Available vehicles</p>
            <p className="type-section-heading">Choose by category</p>
            <p className="type-card-heading">Volvo XC60 Recharge</p>
            <p className="type-body reading-width text-[var(--text-secondary)]">
              Clear type hierarchy helps customers compare vehicles and helps fleet teams scan operational information quickly.
            </p>
            <p className="type-numeric font-semibold">$148 <span className="type-supporting font-normal">per day</span></p>
          </div>
        </section>

        <section className={sectionClass}>
          <SectionHeader title="Buttons and badges" description="One primary action leads each section; secondary actions stay visually quieter." />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button iconRight={HiArrowRight}>View available vehicles</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Deactivate</Button>
            <Button loading loadingLabel="Saving">Save vehicle</Button>
            <Button disabled>Disabled</Button>
            <IconButton label="Save vehicle" variant="outline"><HiBookmark className="h-5 w-5" /></IconButton>
            <IconButton label="Remove item" variant="destructive"><HiXMark className="h-5 w-5" /></IconButton>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>Inactive</Badge>
            <Badge variant="primary">Selected</Badge>
            <Badge variant="success" dot>Available</Badge>
            <Badge variant="warning" dot>Maintenance</Badge>
            <Badge variant="danger" dot>Overdue</Badge>
          </div>
        </section>

        <section className={sectionClass}>
          <SectionHeader title="Form controls" description="Every field has a visible label and can expose supporting or validation text." />
          <Card className="mt-6 max-w-3xl" hover={false}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Pickup location" placeholder="Search a city" icon={HiOutlineMagnifyingGlass} supportingText="Choose a supported RideMint location." />
              <Select label="Vehicle category" placeholder="Select a category" options={['SUV', 'Sedan', 'Electric']} />
              <Input label="Email address" defaultValue="alex@example.com" error="Enter a work or personal email you can access." />
              <Input label="Disabled field" value="Managed by administrator" disabled readOnly />
              <div className="sm:col-span-2">
                <Textarea label="Rental notes" placeholder="Add pickup requirements" supportingText="Do not include payment details." />
              </div>
              <Checkbox label="Email booking updates" description="Receive pickup and return reminders." defaultChecked />
              <fieldset className="space-y-3">
                <legend className="type-label mb-2">Transmission</legend>
                <Radio name="transmission" label="Automatic" defaultChecked />
                <Radio name="transmission" label="Manual" />
              </fieldset>
            </div>
          </Card>
        </section>

        <section className={sectionClass}>
          <SectionHeader
            title="Cards and overlays"
            description="Cards group related content. Restrained lift is reserved for useful interactive surfaces."
            action={<Button size="sm" icon={HiPlus}>Add vehicle</Button>}
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Card as="article" hover>
              <Badge variant="success" dot>Available</Badge>
              <h3 className="type-card-heading mt-5">Volvo XC60 Recharge</h3>
              <p className="type-supporting mt-2">Automatic · Hybrid · 5 seats</p>
              <Card.Footer className="flex items-center justify-between">
                <p className="type-numeric font-semibold">$148 <span className="type-caption font-normal">/ day</span></p>
                <Button variant="ghost" size="sm">View details</Button>
              </Card.Footer>
            </Card>
            <Card hover={false}>
              <h3 className="type-card-heading">Overlay patterns</h3>
              <p className="type-supporting mt-2">Modal and drawer examples include Escape handling and scroll locking.</p>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" onClick={() => setModalOpen(true)}>Open modal</Button>
                <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
                <Button variant="ghost" onClick={() => toast.success('Vehicle details saved.')}>Show toast</Button>
              </div>
            </Card>
          </div>
        </section>

        <section className={sectionClass}>
          <SectionHeader title="Feedback states" description="Stable placeholders and explicit empty/error states prevent ambiguous screens." />
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <Card hover={false}><Skeleton variant="card" /></Card>
            <Card hover={false} padding={false}>
              <EmptyState icon={HiOutlineArchiveBox} title="No vehicles found" description="Try changing or clearing your active filters." action={{ label: 'Clear filters', onClick: () => toast.info('Filters cleared.') }} />
            </Card>
            <Card hover={false} padding={false}>
              <ErrorState icon={HiOutlineExclamationCircle} description="The vehicle list could not be loaded." onRetry={() => toast.info('Trying again…')} />
            </Card>
          </div>
        </section>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm vehicle details"
        description="Review the information before continuing."
      >
        <p className="type-body text-[var(--text-secondary)]">This foundation keeps modal content focused and restores keyboard focus after closing.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setModalOpen(false)}>Continue</Button>
        </div>
      </Modal>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filter vehicles">
        <div className="space-y-5">
          <Select label="Fuel type" placeholder="Any fuel type" options={['Petrol', 'Diesel', 'Electric', 'Hybrid']} />
          <Checkbox label="Available only" description="Hide vehicles that cannot be reserved." />
          <Button fullWidth onClick={() => setDrawerOpen(false)}>Apply filters</Button>
        </div>
      </Drawer>
    </main>
  );
}
