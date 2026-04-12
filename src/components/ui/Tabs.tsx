import { Button } from './Button';
import styles from './Tabs.module.css';

export type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  ariaLabel: string;
};

export function Tabs({ items, selectedId, onSelect, ariaLabel }: TabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => (
        <Button
          key={item.id}
          variant="tab"
          isActive={item.id === selectedId}
          role="tab"
          aria-selected={item.id === selectedId}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
