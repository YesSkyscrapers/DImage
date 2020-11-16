import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView
} from 'react-native';
import Button from '../../theme/Button';
import colors from '../../theme/colors';
import Image from '../../theme/Image';
import SafeArea from '../../theme/SafeArea';

const avatar_urls = [
    'https://danbooru.donmai.us/data/__okunoda_miyoi_touhou_drawn_by_chamaji__9934fbbc9a4a46d049bb08828fd7be8e.jpg',
    'https://danbooru.donmai.us/data/__maribel_hearn_touhou_drawn_by_chamaji__d268417596feca3734b498acf8006410.jpg',
    'https://danbooru.donmai.us/data/__usami_renko_touhou_drawn_by_chamaji__d9e2cbe39d6096a9ee67aed7864b410f.jpg',
    'https://danbooru.donmai.us/data/__haniyasushin_keiki_touhou_drawn_by_chamaji__59b375174d7b98d7a4ca07d44fde1e9e.jpg',
    'https://danbooru.donmai.us/data/__joutouguu_mayumi_touhou_drawn_by_chamaji__087bdd793f9e1458f937b4f16a08308b.jpg',
    'https://danbooru.donmai.us/data/__kurokoma_saki_touhou_drawn_by_chamaji__0e8814e8a035ef39174aeefbfae6ac5f.jpg',
    'https://danbooru.donmai.us/data/__kicchou_yachie_touhou_drawn_by_chamaji__80b15b72cf5845ceaaf02e90bbd54b09.jpg',
    'https://danbooru.donmai.us/data/__niwatari_kutaka_touhou_drawn_by_chamaji__2dea4ab9036b3228323a39e07f2073e7.jpg',
    'https://danbooru.donmai.us/data/__ushizaki_urumi_touhou_drawn_by_chamaji__5b104d88ee98b9dc26768a5ad81aa3e9.jpg',
    'https://danbooru.donmai.us/data/__yorigami_shion_touhou_drawn_by_chamaji__abd0f433da11dc6ff2eea675a52e5817.jpg',
    'https://danbooru.donmai.us/data/__matara_okina_touhou_drawn_by_chamaji__70d6f13498d75221a78a4a6b7c65d65c.jpg',
    'https://danbooru.donmai.us/data/__yatadera_narumi_touhou_drawn_by_chamaji__989d4b3d6f51563f5c3556083aeabd38.jpg',
    'https://danbooru.donmai.us/data/__sakata_nemuno_touhou_drawn_by_chamaji__d479f880faf41cdc1a038a248256f5cb.jpg',
]

const getRandomAvatar = () => {
    return avatar_urls[Math.floor(Math.random() * avatar_urls.length)]
}

export default ProfileComponent = ({

}) => {

    const avatar = getRandomAvatar()

    return (
        <SafeArea safeStyle={styles.flexContainer}>
            <View style={styles.buttonsContainer}>
                <Button style={styles.settingsContainer}>
                    <FontAwesomeIcon icon={faSlidersH} size={25} color={colors.white} />
                </Button>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        url={avatar}
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </View>
            </ScrollView>
        </SafeArea>
    )
}


const styles = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: colors.black,
    },
    avatarContainer: {
        width: Dimensions.get('screen').width * 0.5,
        height: Dimensions.get('screen').width * 0.5,
        borderRadius: Dimensions.get('screen').width * 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        alignSelf: 'center'
    },
    avatar: {
        width: Dimensions.get('screen').width * 0.5,
        height: Dimensions.get('screen').width * 0.5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: colors.darkLayout9
    },
    settingsContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        paddingTop: 50
    }
})