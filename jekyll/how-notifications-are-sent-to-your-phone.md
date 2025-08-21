---
title: How notifications are sent to your phone
description: A comprehensive guide to understanding push notification delivery from server to smartphone
image: https://storage.googleapis.com/junedang_blog_images/push-notifications/push-notification-flow.svg
date: 2024-08-21
---

Push notifications have become an integral part of our digital experience, delivering instant updates from apps even when they're not actively running. But have you ever wondered about the complex journey these notifications take from an app's server to your phone? Let's explore the fascinating infrastructure behind this seemingly simple process.

## How notifications are sent to your phone

### 1. The app doesn't talk to your phone directly

One of the most important concepts to understand is that individual apps cannot directly communicate with your phone. This might seem counterintuitive, but there are compelling technical and practical reasons for this design.

**Why direct communication isn't feasible:**

Your smartphone isn't a server with a public IP address that apps can reach directly. Mobile devices are typically behind NAT (Network Address Translation) on cellular networks or Wi-Fi, making them unreachable from the internet. Additionally, constantly listening for incoming connections would drain your battery rapidly and create significant security vulnerabilities.

**Enter the notification services:**

Instead, both iOS and Android rely on centralized push notification services:

- **Apple Push Notification service (APNs)** for iOS devices
- **Firebase Cloud Messaging (FCM)** for Android devices (previously Google Cloud Messaging)

These services act as intermediaries, maintaining persistent connections with your device and handling the delivery of notifications from app servers. When an app wants to send you a notification, it sends the message to Apple or Google's servers, which then forward it to your device.

**The role of device tokens:**

Each app installation on your device receives a unique device token from the notification service. This token serves as an address that app servers can use to target notifications to your specific device and app combination. The token is opaque and doesn't contain any personal information, but it allows the notification service to route messages correctly.

### 2. The server triggers the event

When something happens that warrants a notification – like receiving a new message, a friend request, or a breaking news alert – the app's backend server initiates the notification process.

**Creating the notification request:**

The server constructs a notification payload containing:

- **Alert information:** The title, body text, and any additional content
- **Badge count:** Number to display on the app icon (iOS)
- **Sound:** Which sound to play when the notification arrives
- **Custom data:** Additional information the app might need when the user taps the notification
- **Targeting information:** The device token(s) to send the notification to

**Authentication and security:**

App servers must authenticate with the notification services before sending messages. This typically involves:

- **API keys or certificates:** Provided by Apple or Google to verify the server's identity
- **App identifiers:** To ensure notifications are only sent for authorized applications
- **Rate limiting:** To prevent abuse and ensure fair usage of the notification infrastructure

**Example payload structure (FCM):**
```json
{
  "to": "device_token_here",
  "notification": {
    "title": "New Message",
    "body": "You have a new message from John"
  },
  "data": {
    "message_id": "12345",
    "chat_id": "chat_67890"
  }
}
```

### 3. The notification pipeline

Once the app server sends the notification request, it enters a sophisticated delivery pipeline managed by Apple or Google.

**Initial processing:**

The notification service receives the request and performs several validation steps:

- Verifies the server's authentication credentials
- Validates the payload format and size limits
- Checks if the target device token is valid and active
- Applies any content filtering or policy checks

**Queuing and routing:**

Notifications don't always get delivered immediately. The system implements intelligent queuing:

- **Priority handling:** Urgent notifications (like calls) get higher priority
- **Batching:** Multiple notifications might be grouped together for efficiency
- **Geographic routing:** Messages are routed to data centers closest to the target device

**Maintaining device connections:**

The notification services maintain persistent connections with devices using optimized protocols:

- **Long-lived connections:** Devices keep a single connection open to the notification service
- **Heartbeat mechanisms:** Regular check-ins to ensure the connection remains active
- **Automatic reconnection:** If the connection drops, devices automatically reconnect
- **Power optimization:** Connections are designed to minimize battery drain

**Quality of Service (QoS):**

Different types of notifications receive different treatment:

- **High priority:** Time-sensitive notifications like incoming calls
- **Normal priority:** Regular app notifications
- **Low priority:** Background sync notifications that can wait

### 4. Delivery to the device

When your device receives a notification from the push service, several things happen in quick succession.

**Operating system handling:**

The device's operating system receives the notification and:

- **Parses the payload:** Extracts the title, message, and any custom data
- **Applies user preferences:** Checks if notifications are enabled for this app
- **Determines presentation:** Decides how to display the notification based on current device state
- **Updates app badge:** If specified, updates the app icon badge count

**Notification presentation:**

Depending on your device state and settings:

- **Lock screen:** Shows as a banner or in the notification center
- **Active usage:** Might appear as a banner at the top of the screen
- **Do Not Disturb:** May be silenced or shown only for priority contacts
- **App-specific settings:** Honors your preferences for each individual app

**App receives the notification:**

When you tap the notification or when the app is already running:

- The app receives the notification payload along with any custom data
- It can update its interface, navigate to specific content, or trigger background processing
- The app might also receive the notification silently in the background for content updates

**Background app refresh:**

Some notifications trigger background processing even if you don't interact with them, allowing apps to update their content so it's fresh when you next open them.

### 5. Why sometimes you don't get them

Despite this sophisticated infrastructure, notifications sometimes fail to reach your device. Here are the common culprits:

**Connectivity issues:**

- **Poor network connection:** Weak cellular or Wi-Fi signals can prevent delivery
- **Network switching:** Moving between Wi-Fi and cellular can temporarily break connections
- **Airplane mode:** Obviously blocks all network communication
- **VPN interference:** Some VPN configurations can disrupt push connections

**Device-level problems:**

- **Invalid tokens:** App reinstallation or device resets can invalidate device tokens
- **Battery optimization:** Aggressive power-saving modes might limit background connectivity
- **Storage full:** Insufficient device storage can prevent notification processing
- **Date/time issues:** Incorrect device time can cause authentication failures

**Server-side issues:**

- **Certificate expiration:** Push certificates need periodic renewal
- **Rate limiting:** Sending too many notifications can trigger throttling
- **Service outages:** APNs or FCM occasionally experience downtime
- **Payload errors:** Malformed notification data gets rejected

**User settings:**

- **Disabled notifications:** Users can turn off notifications per app or globally
- **Do Not Disturb:** Scheduled quiet hours block most notifications
- **Focus modes:** iOS Focus or Android's similar features filter notifications
- **Permission revocation:** Users might have denied notification permissions

**App-specific factors:**

- **Background app restrictions:** Some devices aggressively kill background apps
- **App updates:** New app versions might have notification bugs
- **Server maintenance:** App servers going offline prevent new notifications

### 6. Trade off

The centralized push notification system creates both significant benefits and notable drawbacks.

**Benefits of centralized systems:**

**Battery efficiency:** The single persistent connection model is far more battery-efficient than having every app maintain its own connection. Your device only needs one connection to the notification service instead of dozens.

**Simplified development:** App developers don't need to implement complex networking, queuing, and retry logic. The notification services handle all the infrastructure complexity.

**Reliability and scale:** Apple and Google operate highly reliable, globally distributed systems that can handle billions of notifications daily with high uptime guarantees.

**Security:** Centralized services can implement consistent security measures, including encryption, authentication, and abuse prevention across all apps.

**Network optimization:** Mobile carriers can optimize their networks for the predictable traffic patterns of centralized notification services.

**Drawbacks and limitations:**

**Dependency on platform holders:** Apps are entirely dependent on Apple and Google's services. If these services go down, all push notifications stop working regardless of individual app server health.

**Delivery throttling:** Platform holders can limit notification frequency or apply content filtering, potentially impacting time-sensitive communications.

**Lack of direct control:** Developers have limited visibility into delivery status and can't directly troubleshoot notification failures.

**Privacy concerns:** All notifications flow through Apple or Google's servers, creating potential privacy implications even though the content is typically encrypted.

**Platform lock-in:** The system reinforces the mobile duopoly, as alternatives would require rebuilding the entire notification infrastructure.

**Geographic restrictions:** In some regions, access to Google services (including FCM) may be limited, affecting Android notification delivery.

**Business model influence:** Platform holders could potentially modify notification policies to favor their own services or generate revenue.

Despite these trade-offs, the centralized model has proven successful because the benefits – particularly around battery life and reliability – significantly outweigh the drawbacks for most use cases. The system represents a pragmatic solution to the technical challenges of mobile notification delivery, even as it concentrates considerable power in the hands of two major technology companies.

Understanding this infrastructure helps explain why notifications sometimes behave unexpectedly and highlights the complex engineering required to make this seemingly simple feature work reliably across billions of devices worldwide.