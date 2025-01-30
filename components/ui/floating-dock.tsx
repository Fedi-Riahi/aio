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

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  onItemClick,
  activeCategory, // Accept activeCategory prop
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  onItemClick: (category: string) => void;
  activeCategory: string ; // Define activeCategory as a string
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        onItemClick={onItemClick}
        activeCategory={activeCategory} // Pass activeCategory to FloatingDockDesktop
      />
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        onItemClick={onItemClick}
        activeCategory={activeCategory} // Pass activeCategory to FloatingDockMobile
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  onItemClick,
  activeCategory,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  onItemClick: (category: string) => void;
  activeCategory: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered item index

  return (
    <div className={cn("relative block md:hidden", className)}>
      {/* Scrollable Container */}
      <div className="overflow-x-auto no-scrollbar py-2">
        <div className="flex gap-3 items-center w-max px-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              onHoverStart={() => setHoveredIndex(idx)} // Show tooltip on hover
              onHoverEnd={() => setHoveredIndex(null)} // Hide tooltip when not hovered
              onClick={() => onItemClick(item.title)} // Handle click to set active category
              className="relative"
            >
              {/* Icon Container */}
              <motion.div
                className={`h-12 w-12 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-lg ${
                  activeCategory === item.title
                    ? "!bg-main text-white border-2 border-main"
                    : ""
                }`}
                whileHover={{ scale: 1.1 }} // Scale up on hover
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className={`h-5 w-5 flex items-center justify-center ${
                    activeCategory === item.title ? "text-white" : ""
                  }`}
                >
                  {item.icon}
                </motion.div>
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 2, x: "-50%" }}
                    className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border shadow-xl dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
                  >
                    {item.title ? `${item.title}` : "All"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  onItemClick,
  activeCategory, // Accept activeCategory in FloatingDockDesktop
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  onItemClick: (category: string) => void;
  activeCategory: string;
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
          key={item.title}
          mouseX={mouseX}
          title={item.title}
          icon={item.icon}
          href={item.href}
          onItemClick={onItemClick} // Pass onItemClick to each IconContainer
          activeCategory={activeCategory} // Pass activeCategory to each IconContainer
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  onItemClick,
  activeCategory, // Accept activeCategory in IconContainer
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  onItemClick: (category: string) => void;
  activeCategory: string;
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
    <button
      onClick={() => onItemClick(title)} // Call onItemClick when item is clicked
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)} 
        className={`aspect-square rounded-full bg-white text-black  shadow-lg  flex items-center justify-center relative ${
           activeCategory === title ? "!bg-main text-white border-2 border-main" : ""
        }`} // Highlight active category
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border shadow-xl dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title ? `${title}` : "All"}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={`flex items-center justify-center ${
            activeCategory === title ? "text-white" : ""
          }`}
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}
