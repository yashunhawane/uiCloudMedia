import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { Component } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";
import { colors, radius, shadows, spacing, typography, ui } from "../../src/Theam";

// ── Sub-components ────────────────────────────────────────────────────────────

/** Single info row inside the profile card */
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text
        style={{
          fontSize: typography.sm,
          fontWeight: typography.semibold,
          color: colors.textSecondary,
          letterSpacing: typography.wide,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: typography.md,
          fontWeight: typography.medium,
          color: colors.textPrimary,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default class Profile extends Component {
  state = { pressed: false };

  handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Logged out", "You have been signed out successfully.");
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  render() {
    return (
      <SafeAreaView style={ui.screen}>
        {/* Decorative blobs */}
        <View style={ui.blobTopRight} pointerEvents="none" />
        <View style={ui.blobBottomLeft} pointerEvents="none" />

        <ScrollView
          contentContainerStyle={{
            padding: spacing.xl,
            paddingBottom: spacing["4xl"],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Page Header ── */}
          <View style={{ marginBottom: spacing["2xl"] }}>
            <Text style={ui.heading}>My Profile</Text>
            <Text style={[ui.subheading, { marginTop: spacing.xs }]}>
              Manage your account details
            </Text>
          </View>

          {/* ── Avatar + Name Block ── */}
          <View
            style={[
              ui.card,
              {
                alignItems: "center",
                marginBottom: spacing.xl,
                paddingVertical: spacing["2xl"],
              },
            ]}
          >
            {/* Avatar circle */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: radius.full,
                backgroundColor: colors.primaryLight,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: spacing.lg,
                ...shadows.primary,
              }}
            >
              <Text
                style={{
                  fontSize: typography["2xl"],
                  fontWeight: typography.bold,
                  color: colors.primary,
                }}
              >
                Y
              </Text>
            </View>

            <Text
              style={{
                fontSize: typography.xl,
                fontWeight: typography.bold,
                color: colors.textPrimary,
                letterSpacing: typography.tight,
              }}
            >
              yash123
            </Text>
            <Text
              style={[ui.caption, { marginTop: spacing.xs }]}
            >
              yash@gmail.com
            </Text>

            {/* Active badge */}
            <View
              style={{
                marginTop: spacing.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                backgroundColor: colors.successBg,
                borderRadius: radius.full,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: radius.full,
                  backgroundColor: colors.success,
                }}
              />
              <Text
                style={{
                  fontSize: typography.xs,
                  fontWeight: typography.semibold,
                  color: colors.success,
                  letterSpacing: typography.wide,
                }}
              >
                ACTIVE
              </Text>
            </View>
          </View>

          {/* ── Details Card ── */}
          <View style={[ui.card, { marginBottom: spacing.xl }]}>
            <Text
              style={[
                ui.label,
                { marginBottom: spacing.md },
              ]}
            >
              Account Info
            </Text>

            <InfoRow label="Username" value="yash123" />
            <InfoRow label="Email" value="yash@gmail.com" />
            <InfoRow label="Member since" value="Jan 2024" />

            {/* Last row — no bottom border */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: typography.sm,
                  fontWeight: typography.semibold,
                  color: colors.textSecondary,
                  letterSpacing: typography.wide,
                  textTransform: "uppercase",
                }}
              >
                Role
              </Text>
              <View
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  backgroundColor: colors.accentBlue,
                  borderRadius: radius.full,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.xs,
                    fontWeight: typography.semibold,
                    color: colors.textPrimary,
                    letterSpacing: typography.wide,
                  }}
                >
                  USER
                </Text>
              </View>
            </View>
          </View>

          {/* ── Logout Button ── */}
          <Pressable
            onPress={this.handleLogout}
            onPressIn={() => this.setState({ pressed: true })}
            onPressOut={() => this.setState({ pressed: false })}
            style={[
              ui.buttonPrimary,
              this.state.pressed && ui.buttonPressed,
            ]}
          >
            <Text style={ui.buttonPrimaryText}>Log Out</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }
}