package com.example.data

import com.example.model.HindiEntry

val hindiData = listOf(
    // 13 Swar
    HindiEntry("a", "swar", "swar", "अ", "अनार", "🍎", "अ", "अ से अनार", false),
    HindiEntry("aa", "swar", "swar", "आ", "आम", "🥭", "आ", "आ से आम", false),
    HindiEntry("i", "swar", "swar", "इ", "इमली", "🟤", "इ", "इ से इमली", false),
    HindiEntry("ee", "swar", "swar", "ई", "ईख", "🎋", "ई", "ई से ईख", false),
    HindiEntry("u", "swar", "swar", "उ", "उल्लू", "🦉", "उ", "उ से उल्लू", false),
    HindiEntry("oo", "swar", "swar", "ऊ", "ऊन", "🧶", "ऊ", "ऊ से ऊन", false),
    HindiEntry("ri", "swar", "swar", "ऋ", "ऋषि", "🧘", "ऋ", "ऋ से ऋषि", false),
    HindiEntry("e", "swar", "swar", "ए", "एक", "🎈", "ए", "ए से एक", false),
    HindiEntry("ai", "swar", "swar", "ऐ", "ऐनक", "👓", "ऐ", "ऐ से ऐनक", false),
    HindiEntry("o", "swar", "swar", "ओ", "ओखली", "🥣", "ओ", "ओ से ओखली", false),
    HindiEntry("au", "swar", "swar", "औ", "औज़ार", "🔨", "औ", "औ से औज़ार", false),
    HindiEntry("am", "swar", "swar", "अं", "अंगूर", "🍇", "अं", "अं से अंगूर", false),
    HindiEntry("ah", "swar", "swar", "अः", "अः", "", "अः", "अः", true),

    // 36 Vyanjan
    HindiEntry("ka", "vyanjan", "ka-varg", "क", "कबूतर", "🕊️", "क", "क से कबूतर", false),
    HindiEntry("kha", "vyanjan", "ka-varg", "ख", "खरगोश", "🐇", "ख", "ख से खरगोश", false),
    HindiEntry("ga", "vyanjan", "ka-varg", "ग", "गमला", "🪴", "ग", "ग से गमला", false),
    HindiEntry("gha", "vyanjan", "ka-varg", "घ", "घड़ी", "⏰", "घ", "घ से घड़ी", false),
    HindiEntry("nga", "vyanjan", "ka-varg", "ङ", "ङ", "", "ङ", "ङ", true),

    HindiEntry("cha", "vyanjan", "cha-varg", "च", "चम्मच", "🥄", "च", "च से चम्मच", false),
    HindiEntry("chha", "vyanjan", "cha-varg", "छ", "छतरी", "☂️", "छ", "छ से छतरी", false),
    HindiEntry("ja", "vyanjan", "cha-varg", "ज", "जहाज", "🚢", "ज", "ज से जहाज", false),
    HindiEntry("jha", "vyanjan", "cha-varg", "झ", "झंडा", "🇮🇳", "झ", "झंडा", false),
    HindiEntry("nya", "vyanjan", "cha-varg", "ञ", "ञ", "", "ञ", "ञ", true),

    HindiEntry("ta", "vyanjan", "ta-varg", "ट", "टमाटर", "🍅", "ट", "ट से टमाटर", false),
    HindiEntry("tha", "vyanjan", "ta-varg", "ठ", "ठेला", "🛒", "ठ", "ठ से ठेला", false),
    HindiEntry("da", "vyanjan", "ta-varg", "ड", "डमरू", "🪘", "ड", "ड से डमरू", false),
    HindiEntry("dha", "vyanjan", "ta-varg", "ढ", "ढोल", "🥁", "ढ", "ढ से ढोल", false),
    HindiEntry("na_hard", "vyanjan", "ta-varg", "ण", "ण", "", "ण", "ण", true),

    HindiEntry("ta_soft", "vyanjan", "ta_soft-varg", "त", "तरबूज", "🍉", "त", "त से तरबूज", false),
    HindiEntry("tha_soft", "vyanjan", "ta_soft-varg", "थ", "थाली", "🍽️", "थ", "थ से थाली", false),
    HindiEntry("da_soft", "vyanjan", "ta_soft-varg", "द", "दवात", "🖋️", "द", "द से दवात", false),
    HindiEntry("dha_soft", "vyanjan", "ta_soft-varg", "ध", "धनुष", "🏹", "ध", "ध से धनुष", false),
    HindiEntry("na", "vyanjan", "ta_soft-varg", "न", "नल", "🚰", "न", "न से नल", false),

    HindiEntry("pa", "vyanjan", "pa-varg", "प", "पतंग", "🪁", "प", "प से पतंग", false),
    HindiEntry("pha", "vyanjan", "pa-varg", "फ", "फल", "🍎", "फ", "फ से फल", false),
    HindiEntry("ba", "vyanjan", "pa-varg", "ब", "बतख", "🦆", "ब", "ब से बतख", false),
    HindiEntry("bha", "vyanjan", "pa-varg", "भ", "भालू", "🐻", "भ", "भ से भालू", false),
    HindiEntry("ma", "vyanjan", "pa-varg", "म", "मछली", "🐟", "म", "म से मछली", false),

    HindiEntry("ya", "vyanjan", "antastha", "य", "यज्ञ", "🔥", "य", "य से यज्ञ", false),
    HindiEntry("ra", "vyanjan", "antastha", "र", "रथ", "🛞", "र", "र से रथ", false),
    HindiEntry("la", "vyanjan", "antastha", "ल", "लड्डू", "🟡", "ल", "ल से लड्डू", false),
    HindiEntry("va", "vyanjan", "antastha", "व", "वकील", "⚖️", "व", "व से वकील", false),

    HindiEntry("sha", "vyanjan", "ooshma", "श", "शेर", "🦁", "श", "श से शेर", false),
    HindiEntry("shha", "vyanjan", "ooshma", "ष", "षट्कोण", "⬡", "ष", "ष से षट्कोण", false),
    HindiEntry("sa", "vyanjan", "ooshma", "स", "सेब", "🍏", "स", "स से सेब", false),
    HindiEntry("ha", "vyanjan", "ooshma", "ह", "हल", "🚜", "ह", "ह से हल", false),

    HindiEntry("ksha", "vyanjan", "sanyukt", "क्ष", "क्षत्रिय", "⚔️", "क्ष", "क्ष से क्षत्रिय", false),
    HindiEntry("tra", "vyanjan", "sanyukt", "त्र", "त्रिशूल", "🔱", "त्र", "त्र से त्रिशूल", false),
    HindiEntry("gya", "vyanjan", "sanyukt", "ज्ञ", "ज्ञानी", "📚", "ज्ञ", "ज्ञ से ज्ञानी", false)
)
