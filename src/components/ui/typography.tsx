import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
    variants: {
        variant: {
            display: "text-4xl font-bold tracking-tight lg:text-5xl",
            h1: "text-3xl font-semibold tracking-tight",
            h2: "text-2xl font-semibold tracking-tight",
            h3: "text-xl font-semibold tracking-tight",
            body: "text-base leading-7",
            caption: "text-sm text-muted-foreground",
            label: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        },
        weight: {
            default: "",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
        },
        textColor: {
            default: "text-foreground",
            muted: "text-muted-foreground",
            primary: "text-primary",
            destructive: "text-destructive",
            success: "text-green-600",
            warning: "text-yellow-600",
            error: "text-red-600",
        },
    },
    defaultVariants: {
        variant: "body",
        weight: "default",
        textColor: "default",
    },
})

export interface TypographyProps
    extends Omit<React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label"
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, weight, textColor, as, ...props }, ref) => {
        const Comp = as || (variant === "display" || variant === "h1" || variant === "h2" || variant === "h3" ? "h1" : "p")

        // Cast to any to avoid TS issues with dynamic component ref
        return React.createElement(Comp, {
            className: cn(typographyVariants({ variant, weight, textColor, className })),
            ref: ref as any,
            ...props,
        })
    }
)
Typography.displayName = "Typography"

export { Typography, typographyVariants }

export const Display = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
    <Typography ref={ref} variant="display" {...props} />
))
Display.displayName = "Display"

export const H1 = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
    <Typography ref={ref} variant="h1" as="h1" {...props} />
))
H1.displayName = "H1"

export const H2 = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
    <Typography ref={ref} variant="h2" as="h2" {...props} />
))
H2.displayName = "H2"

export const H3 = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
    <Typography ref={ref} variant="h3" as="h3" {...props} />
))
H3.displayName = "H3"

export const Body = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
    <Typography ref={ref} variant="body" as="p" {...props} />
))
Body.displayName = "Body"

export const Caption = React.forwardRef<HTMLElement, TypographyProps>((props, ref) => (
    <Typography ref={ref} variant="caption" as="span" {...props} />
))
Caption.displayName = "Caption"
