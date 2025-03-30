import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

// Define the Category interface with an id field
interface Category {
  id: string; // Added id field
  name: string;
  icon: React.ReactNode;
  href: string;
}

export const FloatingDock = ({
  items,
  desktopClassName,
  onItemClick,
  activeCategory,
}: {
  items: Category[];
  desktopClassName?: string;
  mobileClassName?: string;
  onItemClick: (categoryId: string) => void; // Updated to expect ID
  activeCategory: string; // This will now track the ID
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        onItemClick={onItemClick}
        activeCategory={activeCategory}
      />
      {/* Uncomment and update FloatingDockMobile if needed */}
      {/* <FloatingDockMobile
        items={items}
        className={mobileClassName}
        onItemClick={onItemClick}
        activeCategory={activeCategory}
      /> */}
    </>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  onItemClick,
  activeCategory,
}: {
  items: Category[];
  className?: string;
  onItemClick: (categoryId: string) => void; // Updated to expect ID
  activeCategory: string; // Tracks the ID
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-16 gap-4 items-end rounded-2xl dark:bg-neutral-900 pt-8",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          key={item.id} // Use id as key for uniqueness
          mouseX={mouseX}
          id={item.id} // Pass id
          name={item.name} // Still pass name for display
          icon={item.icon}
          href={item.href}
          onItemClick={onItemClick}
          activeCategory={activeCategory}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  id, // Added id prop
  name,
  icon,
  onItemClick,
  activeCategory,
}: {
  mouseX: MotionValue;
  id: string; // Added id
  name: string;
  icon: React.ReactNode;
  href: string;
  onItemClick: (categoryId: string) => void; // Updated to expect ID
  activeCategory: string; // Tracks the ID
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [50, 90, 50]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [50, 90, 50]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <button onClick={() => onItemClick(id)}> {/* Pass id instead of name */}
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`aspect-square rounded-full bg-offwhite text-foreground shadow-lg flex items-center justify-center relative ${
          activeCategory === id ? "!bg-main text-foreground border-2 border-main" : "" // Use id for active check
        }`}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border shadow-xl dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {name || "All"} {/* Still display name */}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={`flex items-center justify-center ${
            activeCategory === id ? "text-foreground" : "" // Use id for active check
          }`}
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}
