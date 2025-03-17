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

// Define the Category interface to match your data structure
interface Category {
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
  onItemClick: (category: string) => void;
  activeCategory: string;
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

// Uncomment and update if you want to use the mobile version
// const FloatingDockMobile = ({
//   items,
//   className,
//   onItemClick,
//   activeCategory,
// }: {
//   items: Category[];
//   className?: string;
//   onItemClick: (category: string) => void;
//   activeCategory: string;
// }) => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   return (
//     <div className={cn("relative block md:hidden", className)}>
//       <div className="overflow-x-auto no-scrollbar py-2">
//         <div className="flex gap-3 items-center w-max px-4">
//           {items.map((item, idx) => (
//             <motion.div
//               key={item.name}
//               onHoverStart={() => setHoveredIndex(idx)}
//               onHoverEnd={() => setHoveredIndex(null)}
//               onClick={() => onItemClick(item.name)}
//               className="relative"
//             >
//               <motion.div
//                 className={`h-12 w-12 rounded-full bg-offwhite text-foreground dark:bg-neutral-900 flex items-center justify-center shadow-lg cursor-pointer ${
//                   activeCategory === item.name
//                     ? "!bg-main text-white border-2 border-main"
//                     : ""
//                 }`}
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
//               >
//                 <motion.div
//                   className={`h-5 w-5 flex items-center justify-center ${
//                     activeCategory === item.name ? "text-white" : ""
//                   }`}
//                 >
//                   {item.icon}
//                 </motion.div>
//               </motion.div>
//               <AnimatePresence>
//                 {hoveredIndex === idx && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, x: "-50%" }}
//                     animate={{ opacity: 1, y: 0, x: "-50%" }}
//                     exit={{ opacity: 0, y: 2, x: "-50%" }}
//                     className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border shadow-xl dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-background absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
//                   >
//                     {item.name || "All"}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

const FloatingDockDesktop = ({
  items,
  className,
  onItemClick,
  activeCategory,
}: {
  items: Category[];
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
          key={item.name} // Use name as key
          mouseX={mouseX}
          name={item.name} // Pass name instead of title
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
  name, // Change title to name
  icon,
  onItemClick,
  activeCategory,
}: {
  mouseX: MotionValue;
  name: string; // Update prop name
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
    <button onClick={() => onItemClick(name)}> {/* Use name instead of title */}
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`aspect-square rounded-full bg-offwhite text-foreground shadow-lg flex items-center justify-center relative ${
          activeCategory === name ? "!bg-main text-foreground border-2 border-main" : ""
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
              {name || "All"} {/* Use name instead of title */}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={`flex items-center justify-center ${
            activeCategory === name ? "text-foreground" : ""
          }`}
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}
