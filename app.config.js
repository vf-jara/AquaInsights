export default {
    expo: {
        name: 'AquaInsights',
        slug: 'aquainsights',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.viniciusjara.aquainsights',
            googleServicesFile: './GoogleServices-Info.plist',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            package: 'com.viniciusjara.aquainsights',
            googleServicesFile:
                process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/splash-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
            ],
            [
                'expo-build-properties',
                {
                    ios: {
                        useFrameworks: 'static',
                    },
                },
            ],
            '@react-native-firebase/app',
            '@react-native-firebase/auth',
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: '7f73c800-4e8a-48b4-9e44-8b90b30910a4',
            },
        },
        owner: 'vfjara',
    },
}
