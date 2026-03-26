import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { signupUser } from "../../src/services/authService";

export default function Signup() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signupUser({ userName, email, password });
      router.replace("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text>Signup</Text>

      <TextInput
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}