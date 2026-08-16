import { Activity, Flame, Droplets, Target, HandHeart, Layers, LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ServiceIconProps {
  iconKey?: string;
  serviceId?: string;
  className?: string;
  iconClassName?: string;
}

interface IconConfig {
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  ringColor: string;
  label: string;
}

const SERVICE_ICON_MAP: Record<string, IconConfig> = {
  'moving-qi': {
    icon: Activity,
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    ringColor: 'ring-teal-500/20',
    label: 'Qi Flow & Meridian Stimulation',
  },
  'needle': {
    icon: Activity,
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    ringColor: 'ring-teal-500/20',
    label: 'Qi Flow & Meridian Stimulation',
  },
  'moxa': {
    icon: Flame,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    ringColor: 'ring-amber-500/20',
    label: 'Thermal Warming Therapy',
  },
  'flame': {
    icon: Flame,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    ringColor: 'ring-amber-500/20',
    label: 'Thermal Warming Therapy',
  },
  'cupping': {
    icon: Droplets,
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    ringColor: 'ring-cyan-500/20',
    label: 'Hydration & Microcirculation Flow',
  },
  'cup': {
    icon: Droplets,
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    ringColor: 'ring-cyan-500/20',
    label: 'Hydration & Microcirculation Flow',
  },
  'microsystem': {
    icon: Target,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    ringColor: 'ring-indigo-500/20',
    label: 'Precision Neural & Reflex Points',
  },
  'zap': {
    icon: Target,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    ringColor: 'ring-indigo-500/20',
    label: 'Precision Neural & Reflex Points',
  },
  'avicenna': {
    icon: HandHeart,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    ringColor: 'ring-emerald-500/20',
    label: 'Healing Hands & Natural Restoration',
  },
  'sparkles': {
    icon: HandHeart,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    ringColor: 'ring-emerald-500/20',
    label: 'Healing Hands & Natural Restoration',
  },
  'combination-therapy': {
    icon: Layers,
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    ringColor: 'ring-rose-500/20',
    label: 'Integrative Multimodal Synergy',
  },
  'radio': {
    icon: Layers,
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    ringColor: 'ring-rose-500/20',
    label: 'Integrative Multimodal Synergy',
  },
};

export function ServiceIcon({
  iconKey,
  serviceId,
  className,
  iconClassName
}: ServiceIconProps) {
  const key = serviceId || iconKey || 'moving-qi';
  const config = SERVICE_ICON_MAP[key] || SERVICE_ICON_MAP['moving-qi'];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl transition-transform",
        config.bgColor,
        config.textColor,
        className
      )}
      title={config.label}
    >
      <IconComponent className={cn("w-5 h-5", iconClassName)} strokeWidth={2} />
    </div>
  );
}
