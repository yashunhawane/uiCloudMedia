// ─────────────────────────────────────────────
//  theme.ts  —  Single source of truth for the app's visual style
//  Import what you need: colors, typography, spacing, shadows, radius, styles
// ─────────────────────────────────────────────

import { StyleSheet, TextStyle } from "react-native";

// ── Colors ────────────────────────────────────
export const colors = {
  // Brand
  primary:        "#FF5C5C",
  primaryDark:    "#E04848",
  primaryLight:   "#FFD6D6",

  // Backgrounds
  background:     "#F4F4F8",
  surface:        "#FFFFFF",
  surfaceMuted:   "#FAFAFA",

  // Text
  textPrimary:    "#1A1A2E",
  textSecondary:  "#888888",
  textMuted:      "#AAAAAA",
  textInverse:    "#FFFFFF",

  // Borders
  border:         "#E5E5EE",
  borderFocused:  "#FF5C5C",

  // Accents (for blobs, tags, badges etc.)
  accentBlue:     "#D6E4FF",
  accentCoral:    "#FFD6D6",

  // Semantic
  error:          "#FF5C5C",
  errorBg:        "#FFF0F0",
  success:        "#34C759",
  successBg:      "#F0FFF4",
  warning:        "#FF9500",
  warningBg:      "#FFFBF0",

  // Overlays
  overlayDark:    "rgba(0,0,0,0.55)",
  overlayLight:   "rgba(255,255,255,0.85)",
} as const;

// ── Typography ────────────────────────────────
export const typography = {
  // Sizes
  xs:   11,
  sm:   13,
  md:   15,
  lg:   17,
  xl:   20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 34,

  // Weights (cast so RN accepts them)
  regular:      "400" as TextStyle["fontWeight"],
  medium:       "500" as TextStyle["fontWeight"],
  semibold:     "600" as TextStyle["fontWeight"],
  bold:         "700" as TextStyle["fontWeight"],
  extrabold:    "800" as TextStyle["fontWeight"],

  // Letter spacing
  tight:  -0.5,
  normal:  0,
  wide:    0.3,
  wider:   0.6,
} as const;

// ── Spacing ───────────────────────────────────
export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
} as const;

// ── Border Radius ─────────────────────────────
export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  "2xl": 28,
  full: 9999,
} as const;

// ── Shadows ───────────────────────────────────
export const shadows = {
  sm: {
    shadowColor:   colors.textPrimary,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  8,
    elevation:     3,
  },
  md: {
    shadowColor:   colors.textPrimary,
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius:  16,
    elevation:     6,
  },
  lg: {
    shadowColor:   colors.textPrimary,
    shadowOffset:  { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius:  32,
    elevation:     10,
  },
  primary: {
    shadowColor:   colors.primary,
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius:  12,
    elevation:     6,
  },
} as const;

// ── Reusable Component Styles ─────────────────
//  Use these directly in your screens/components
//  e.g.  style={[ui.card, { marginTop: spacing.lg }]}
export const ui = StyleSheet.create({

  // ── Layout ──
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ── Card ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    ...shadows.lg,
  },
  cardSm: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },

  // ── Inputs ──
  input: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.lg,
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.borderFocused,
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: typography.wide,
  },

  // ── Buttons ──
  buttonPrimary: {
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.primary,
  },
  buttonPrimaryText: {
    color: colors.textInverse,
    fontSize: typography.lg,
    fontWeight: typography.bold,
    letterSpacing: typography.wide,
  },
  buttonSecondary: {
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    letterSpacing: typography.normal,
  },
  buttonPressed: {
    opacity: 0.82,
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontWeight: typography.medium,
  },

  // ── Feedback Banners ──
  errorBox: {
    backgroundColor: colors.errorBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.primaryDark,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  successBox: {
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  successText: {
    color: colors.success,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },

  // ── Typography helpers ──
  heading: {
    fontSize: typography["3xl"],
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.tight,
  },
  subheading: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontWeight: typography.regular,
  },
  bodyText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.regular,
  },
  caption: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontWeight: typography.regular,
  },
  linkText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.semibold,
  },

  // ── Logo Mark ──
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoMarkText: {
    color: colors.textInverse,
    fontSize: 20,
  },

  // ── Background Blobs (decorative) ──
  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.accentCoral,
    opacity: 0.55,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.accentBlue,
    opacity: 0.45,
  },

  // ── Home Screen — Header ──
  homeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing["2xl"] + 8,
    paddingBottom: spacing.lg,
  },
  homeHeaderTitle: {
    fontSize: typography["2xl"],
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.tight,
  },
  homeHeaderSub: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.regular,
    marginTop: 2,
  },

  // ── Home Screen — Avatar Button ──
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.primary,
  },
  avatarText: {
    color: colors.textInverse,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },

  // ── Home Screen — Grid / List ──
  gridContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    gap: spacing.sm,
  },
  gridRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  // ── Home Screen — Media Card ──
  mediaCard: {
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.border,
    ...shadows.md,
  },
  mediaCardImage: {
    width: "100%",
    height: "100%",
  },
  mediaCardVideoPreview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  mediaCardVideoPlayButton: {
    width: 54,
    height: 54,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  mediaCardVideoPlayIcon: {
    color: colors.textInverse,
    fontSize: typography.lg,
    marginLeft: 2,
  },
  mediaCardVideoLabel: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    letterSpacing: typography.wide,
  },
  mediaCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "transparent",
  },
  mediaCardMeta: {
    position: "absolute",
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
  },
  mediaCardTimestamp: {
    fontSize: typography.xs,
    color: colors.overlayLight,
    fontWeight: typography.medium,
    letterSpacing: typography.wide,
  },

  // ── Home Screen — Video Badge ──
  videoBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.overlayDark,
    borderRadius: radius.full,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  videoBadgeText: {
    color: colors.textInverse,
    fontSize: 10,
  },

  // ── Home Screen — List Footer Loader ──
  listFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  listFooterText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontWeight: typography.medium,
  },

  viewerBackdrop: {
    flex: 1,
    backgroundColor: colors.overlayDark,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  viewerTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  viewerCloseButton: {
    minHeight: 42,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },
  viewerCloseText: {
    color: colors.textInverse,
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  viewerLikeButton: {
    minHeight: 42,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.overlayLight,
    justifyContent: "center",
    alignItems: "center",
  },
  viewerLikeButtonActive: {
    backgroundColor: colors.primary,
  },
  viewerLikeText: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  viewerLikeTextActive: {
    color: colors.textInverse,
  },
  viewerMediaWrap: {
    flex: 1,
    borderRadius: radius["2xl"],
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
  },
  viewerMedia: {
    width: "100%",
    height: "100%",
  },
  viewerMetaPanel: {
    paddingTop: spacing.lg,
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  viewerTypeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  viewerTypeChipText: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    letterSpacing: typography.wide,
  },
  viewerTimestampLarge: {
    color: colors.textInverse,
    fontSize: typography.lg,
    fontWeight: typography.medium,
  },
// ── FAB (Floating Action Button) ──
  fab: {
    position: "absolute",
    bottom: spacing["2xl"],
    right: spacing.lg,
  },
  fabBtn: {
    width: 58,
    height: 58,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.primary,
  },
  fabIcon: {
    color: colors.textInverse,
    fontSize: 32,
    fontWeight: typography.regular,
    lineHeight: 36,
    textAlign: "center",
  },
});

