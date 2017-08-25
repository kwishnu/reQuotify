module.exports = [
    {
		title: 'Home',
		index: '0',
		type: 'home',
        link: 'home'
    },
    {
		title: 'FAQ',
		index: '1',
		type: 'about',
        link: 'mission'
    },
    {
		title: 'How To Play',
		index: '2',
		type: 'home',
        link: 'intro'
    },
    {
		title: 'Settings',
		index: '3',
		type: 'home',
        link: 'settings'
    },
    {
		title: 'About',
		index: '4',
		type: 'about',
        link: 'about'
    },
    {
		title: 'Collections',
		index: '5',
		type: 'store',
        link: 'store',
        data:[
                {
                name: 'Inspiration',
                product_id: 'rv.verse.collection.inspiration',
                show: 'true',
                num_verses: '50',
                color: '#85c613'
                },
                {
                name: 'Love',
                product_id: 'rv.verse.collection.love',
                show: 'true',
                num_verses: '50',
                color: '#831d1d'
                },
                {
                name: 'Hope',
                product_id: 'rv.verse.collection.hope',
                show: 'true',
                num_verses: '50',
                color: '#70f1ec'
                },
				{
				name: 'Strength',
				product_id: 'rv.verse.collection.strength',
				show: 'true',
				num_verses: '50',
				color: '#7385a5'
				}
            ]
    },
    {
		title: 'Old Testament',
		index: '6',
		type: 'store',
        link: 'store',
        data:[
                {
                name: 'Genesis',
                product_id: 'rv.verse.book.genesis',
                show: 'true',
                color: '#77c019',
                num_verses: '100'
                },
                {
                name: 'Psalms',
                product_id: 'rv.verse.book.psalms',
                show: 'true',
                color: '#7260b2',
                num_verses: '100'
                }
            ]
    },
    {
		title: 'New Testament',
		index: '7',
		type: 'store',
        link: 'store',
        data:[
                {
                name: 'Matthew',
                product_id: 'rv.verse.book.matthew',
                show: 'true',
                color: '#1780ec',
                num_verses: '50'
                },
				{
                name: 'John',
                product_id: 'rv.verse.book.john',
                show: 'true',
                color: '#107088',
                num_verses: '50',
                num_chapters: '21'
                },
                {
                name: 'Revelation',
                product_id: 'rv.verse.book.revelation',
                show: 'true',
                color: '#6d920a',
                num_verses: '50'
                }
            ]
    },
    {
		title: 'Value Combinations',
		index: '8',
		type: 'store',
        link: 'store',
        data:[
                {
                name: ['John', 'Inspiration', 'Love'],
                product_id: 'b.john.c.inspiration.c.love',
                show: 'true',
                price: '$1.99',
                color: '#860840',
                num_verses: ['50', '50', '50']
                },
                {
                name: ['Hope', 'Strength', 'Inspiration'],
                product_id: 'c.hope.c.strength.c.inspiration',
                show: 'true',
                price: '$1.99',
                color: '#234074',
                num_verses: ['50', '50', '50']
                },
                {
                name: ['Genesis', 'Psalms', '1000 Hints'],
                product_id: 'b.genesis.b.psalms.h.1000',
                show: 'true',
                price: '$2.99',
                color: '#4ab919',
                num_verses: ['100', '100', '']
                },
                {
                name: ['Matthew', 'Revelation', '500 Hints'],
                product_id: 'b.matthew.b.revelation.h.500',
                show: 'true',
                price: '$1.99',
                color: '#536ac0',
                num_verses: ['50', '50', '']
                }
            ]
    },
    {
		title: 'Popular',
		index: '9',
		type: 'store',
        link: 'store',
        data:[
                {
                name: 'Inspiration',
                product_id: 'rv.verse.collection.inspiration',
                show: 'true',
                num_verses: '50',
                color: '#85c613'
                },
                {
                name: ['John', 'Inspiration', 'Love'],
                product_id: 'b.john.c.inspiration.c.love',
                show: 'true',
                price: '$1.99',
                color: '#860840',
                num_verses: ['50', '50', '50']
                },
                {
                name: ['Genesis', 'Psalms', '1000 Hints'],
                product_id: 'b.genesis.b.psalms.h.1000',
                show: 'true',
                price: '$2.99',
                color: '#4ab919',
                num_verses: ['100', '100', '']
                },
				{
                name: 'John',
                product_id: 'rv.verse.book.john',
                show: 'true',
                color: '#107088',
                num_verses: '50'
                },
                {
                name: 'Love',
                product_id: 'rv.verse.collection.love',
                show: 'true',
                num_verses: '50',
                color: '#831d1d'
                },
                {
                name: ['Matthew', 'Revelation', '500 Hints'],
                product_id: 'b.matthew.b.revelation.h.500',
                show: 'true',
                price: '$1.99',
                color: '#536ac0',
                num_verses: ['50', '50', '']
                },
                {
                name: 'Revelation',
                product_id: 'rv.verse.book.revelation',
                show: 'true',
                color: '#6d920a',
                num_verses: '50'
                }
            ]
    },
    {
		title: 'Hint Packages',
		index: '10',
		type: 'store',
        link: 'store',
    },

    {
		title: 'Facebook',
		index: '11',
		type: 'social',
        link: 'facebook'
    },
    {
		title: 'Twitter',
		index: '12',
		type: 'social',
        link: 'twitter'
    },
	{
		title: 'Quote of the Day',
		index: '13',
		type: 'daily',
		show: 'true',
		num_verses: '1',
		num_solved: '0',
        product_id: '',
		bg_color: '#055105',
		verses:[
            `2**Matthew 6:33**But seek first God’s Kingdom, and his righteousness; and all these things will be given to you as well.`
        ]
	},
	{
		title: 'Last Three Days',
		index: '14',
		type: 'daily',
		show: 'true',
		num_verses: '3',
		num_solved: '0',
        product_id: '',
		bg_color: '#795959',
		verses:[
            `2**Jeremiah 33:3**Call to me, and I will answer you, and will show you great and difficult things, which you don’t know.’`,
            `2**Psalm 37:4**Also delight yourself in the Lord, and he will give you the desires of your heart.`,
            `2**Proverbs 3:5**Trust in the Lord with all your heart, and lean not on your own understanding. In all your ways acknowledge him, and he will make your paths straight.`
        ]
	},
	{
		title: 'Last Thirty Days',
		index: '15',
		type: 'daily',
		show: 'false',
		num_verses: '30',
		num_solved: '0',
        product_id: '',
		bg_color: '#eea805',
		verses:[
            `2**Jeremiah 33:3**Call to me, and I will answer you, and will show you great and difficult things, which you don’t know.’`,
            `2**Psalm 37:4**Also delight yourself in the Lord, and he will give you the desires of your heart.`,
            `2**Proverbs 3:5**Trust in the Lord with all your heart, and lean not on your own understanding. In all your ways acknowledge him, and he will make your paths straight.`,
            `2**Romans 8:18**For I consider that the sufferings of this present time are not worthy to be compared with the glory which will be revealed toward us.`,
            `2**1 Corinthians 15:58**Therefore, my beloved brothers, be steadfast, immovable, always abounding in the Lord’s work, because you know that your labor is not in vain in the Lord.`,
            `2**Proverbs 22:1**A good name is more desirable than great riches, and loving favor is better than silver and gold. The rich and the poor have this in common: the Lord is the maker of them all.`,
            `2**Matthew 6:19**Don’t lay up treasures for yourselves on the earth, where moth and rust consume, and where thieves break through and steal; but lay up for yourselves treasures in heaven`,
            `2**Proverbs 11:30**The fruit of the righteous is a tree of life. He who is wise wins souls.`,
            `2**Romans 6:23**For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.`,
            `2**Matthew 6:33**But seek first God’s Kingdom, and his righteousness; and all these things will be given to you as well.`,
            `2**Proverbs 27:17**Iron sharpens iron; so a man sharpens his friend’s countenance. Whoever tends the fig tree shall eat its fruit.`,
            `2**Psalms 41:1**Blessed is he who considers the poor. the Lord will deliver him in the day of evil.`,
            `2**Deuteronomy 4:39**Know therefore today, and take it to heart, that the Lord himself is God in heaven above and on the earth beneath. There is no one else.`,
            `2**Jeremiah 31:33**But this is the covenant that I will make with the house of Israel after those days,” says the Lord: “I will put my law in their inward parts, and I will write it in their heart.`,
            `2**Psalms 139:23-24**Search me, God, and know my heart. Try me, and know my thoughts. See if there is any wicked way in me, and lead me in the everlasting way.`,
            `2**2 Corinthians 6:18**I will be to you a Father. You will be to me sons and daughters,’ says the Lord Almighty.”`,
            `2**Micah 4:5**Indeed all the nations may walk in the name of their gods; but we will walk in the name of the Lord our God forever and ever.`,
            `2**Zephaniah 3:16**In that day, it will be said to Jerusalem, “Don’t be afraid, Zion. Don’t let your hands be weak.”`,
            `2**Isaiah 49:16**Behold, I have engraved you on the palms of my hands. Your walls are continually before me.`,
            `2**Jeremiah 10:23**Lord, I know that the way of man is not in himself. It is not in man who walks to direct his steps.`,
            `2**Ecclesiastes 12:13**This is the end of the matter. All has been heard. Fear God and keep his commandments; for this is the whole duty of man.`,
            `2**1 Corinthians 10:13**No temptation has taken you except what is common to man. God is faithful, who will not allow you to be tempted above what you are able`,
            `2**Joel 2:1**Blow the trumpet in Zion, and sound an alarm in my holy mountain! Let all the inhabitants of the land tremble, for the day of the Lord comes, for it is close at hand`,
            `2**Judges 2:2**You shall make no covenant with the inhabitants of this land. You shall break down their altars.’ But you have not listened to my voice. Why have you done this?`,
            `2**Ephesians 5:19**Speaking to one another in psalms, hymns, and spiritual songs; singing and making melody in your heart to the Lord`,
            `2**Colossians 3:15**And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful.`,
            `2**Psalms 139:14**I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well.`,
            `2**Psalms 97:11**Light is sown for the righteous, and gladness for the upright in heart.`,
            `2**Romans 5:6**For while we were yet weak, at the right time Christ died for the ungodly.`,
            `2**2 Peter 3:18**But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be the glory both now and forever. Amen.`
        ]
	},
	{
		title: 'Worth Repeating',
		index: '16',
		type: 'mypack',
		show: 'true',
		num_verses: '30',
		num_solved: '0',
		solved: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        product_id: '0.0.collection.0',
		bg_color: '#2B0B30',
		verses:[
            `2**Genesis 1:1**In the beginning, God created the heavens and the earth. The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.`,
            `2**Genesis 1:3**God said, “Let there be light,” and there was light. God saw the light, and saw that it was good.`,
            `2**John 3:16**For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.`,
            `2**Matthew 6:33**But seek first God’s Kingdom, and his righteousness; and all these things will be given to you as well.`,
            `2**Romans 6:23**For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.`,
            `2**Psalms 32:11**Be glad in the Lord, and rejoice, you righteous!  Shout for joy, all you who are upright in heart!`,
            `2**Jeremiah 29:11**For I know the thoughts that I think toward you,” says the Lord, “thoughts of peace, and not of evil, to give you hope and a future.`,
            `2**Romans 12:2**Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.`,
            `2**John 16:33**I have told you these things, that in me you may have peace. In the world you have trouble; but cheer up! I have overcome the world.”`,
            `2**Romans 3:4**May it never be! Yes, let God be found true, but every man a liar. As it is written, “that you might be justified in your words, and might prevail when you come into judgment.”`,
            `2**Matthew 7:13**Enter in by the narrow gate; for wide is the gate and broad is the way that leads to destruction, and many are those who enter in by it.`,
            `2**Proverbs 16:3**Commit your deeds to the Lord, and your plans shall succeed. The Lord has made everything for its own end—  yes, even the wicked for the day of evil.`,
            `2**1 Timothy 4:12**Let no man despise your youth; but be an example to those who believe, in word, in your way of life, in love, in spirit, in faith, and in purity.`,
            `2**Micah 6:8**He has shown you, O man, what is good. What does the Lord require of you, but to act justly, to love mercy, and to walk humbly with your God?`,
            `2**Jeremiah 29:11**For I know the thoughts that I think toward you,” says the Lord, “thoughts of peace, and not of evil, to give you hope and a future.`,
            `2**Matthew 6:34**Therefore don’t be anxious for tomorrow, for tomorrow will be anxious for itself. Each day’s own trouble is sufficient.`,
            `2**John 6:40**This is the will of the one who sent me, that everyone who sees the Son, and believes in him, should have eternal life; and I will raise him up at the last day.”`,
            `2**1 Corinthians 10:31**Whether therefore you eat, or drink, or whatever you do, do all to the glory of God.`,
            `2**Isaiah 2:21**To go into the caverns of the rocks, and into the clefts of the ragged rocks, from before the terror of the Lord, and from the glory of his majesty, when he arises to shake the earth mightily.`,
            `2**Psalms 119:36-37**Turn my heart toward your statutes, not toward selfish gain. Turn my eyes away from looking at worthless things. Revive me in your ways.`,
            `2**Revelation 6:13**The stars of the sky fell to the earth, like a fig tree dropping its unripe figs when it is shaken by a great wind.`,
            `2**1 John 2:1**My little children, I write these things to you so that you may not sin. If anyone sins, we have a Counselor with the Father, Jesus Christ, the righteous.`,
            `2**Genesis 1:22**God blessed them, saying, “Be fruitful, and multiply, and fill the waters in the seas, and let birds multiply on the earth.”`,
            `2**Psalms 3:3-4**But you, Lord, are a shield around me, my glory, and the one who lifts up my head. I cry to the Lord with my voice, and he answers me out of his holy hill.`,
            `2**Matthew 1:21**She shall give birth to a son. You shall call his name Jesus, for it is he who shall save his people from their sins.”`,
            `2**Matthew 2:8**He sent them to Bethlehem, and said, “Go and search diligently for the young child. When you have found him, bring me word, so that I also may come and worship him.”`,
            `2**Proverbs 21:15**It is joy to the righteous to do justice; but it is a destruction to the workers of iniquity.`,
            `2**Revelation 21:2**I saw the holy city, New Jerusalem, coming down out of heaven from God, prepared like a bride adorned for her husband.`,
            `2**Psalms 23:4**Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.`,
            `2**Revelation 23:13**I am the Alpha and the Omega, the First and the Last, the Beginning and the End.`
        ]
	},
	{
		title: 'Favorites',
		index: '17',
		type: 'mypack',
		show: 'false',
		num_verses: '0',
		num_solved: '0',
		solved: [],
        product_id: '0.0.favorites.0',
		bg_color: '#b21111',
		verses:[
        ]
	},
	{
		title: '',
		index: '18',
		type: 'forsale',
        product_id: '',
		show: 'true',
		bg_color: '#000000'
	},
	{
		title: '',
		index: '19',
		type: 'forsale',
        product_id: '',
		show: 'true',
		bg_color: '#000000'
	},
	{
		title: '',
		index: '20',
		type: 'forsale',
        product_id: '',
		show: 'true',
		bg_color: '#000000'
	},
	{
		title: '',
		index: '21',
		type: 'forsale',
        product_id: '',
		show: 'true',
		bg_color: '#000000'
	}
];