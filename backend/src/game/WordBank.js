export class WordBank {
  constructor() {
    this.words = {
      OBJECT: [
        'Umbrella', 'Scissors', 'Telephone', 'Laptop', 'Camera',
        'Bicycle', 'Guitar', 'Sunglasses', 'Backpack', 'Wallet',
        'Paintbrush', 'Microphone', 'Telescope', 'Compass', 'Flashlight',
        'Hammer', 'Kettle', 'Mirror', 'Pillow', 'Stapler',
        'Thermometer', 'Toothbrush', 'Umbrella', 'Vase', 'Whistle'
      ],
      PERSON: [
        'Astronaut', 'Chef', 'Detective', 'Engineer', 'Firefighter',
        'Journalist', 'Lawyer', 'Musician', 'Nurse', 'Pilot',
        'Scientist', 'Teacher', 'Veterinarian', 'Architect', 'Dentist',
        'Electrician', 'Farmer', 'Librarian', 'Mechanic', 'Photographer',
        'Plumber', 'Programmer', 'Surgeon', 'Waiter', 'Zookeeper'
      ],
      ACTION: [
        'Dancing', 'Swimming', 'Cooking', 'Running', 'Singing',
        'Climbing', 'Painting', 'Reading', 'Writing', 'Jumping',
        'Sleeping', 'Eating', 'Driving', 'Flying', 'Laughing',
        'Crying', 'Whispering', 'Shouting', 'Knitting', 'Jogging',
        'Meditating', 'Stretching', 'Yawning', 'Sneezing', 'Hiccuping'
      ],
      WORLD: [
        'Mountain', 'Ocean', 'Desert', 'Forest', 'Beach',
        'Volcano', 'Glacier', 'Canyon', 'Waterfall', 'Island',
        'River', 'Lake', 'Cave', 'Valley', 'Cliff',
        'Jungle', 'Swamp', 'Meadow', 'Prairie', 'Tundra',
        'Reef', 'Marsh', 'Plateau', 'Peninsula', 'Archipelago'
      ],
      NATURE: [
        'Butterfly', 'Dolphin', 'Eagle', 'Elephant', 'Tiger',
        'Giraffe', 'Penguin', 'Kangaroo', 'Whale', 'Octopus',
        'Spider', 'Bee', 'Snake', 'Crocodile', 'Parrot',
        'Wolf', 'Bear', 'Fox', 'Deer', 'Rabbit',
        'Owl', 'Hawk', 'Seal', 'Otter', 'Flamingo'
      ],
      RANDOM: [
        'Rainbow', 'Thunder', 'Shadow', 'Dream', 'Miracle',
        'Mystery', 'Adventure', 'Memory', 'Fortune', 'Victory',
        'Treasure', 'Secret', 'Magic', 'Legend', 'Destiny',
        'Chaos', 'Harmony', 'Freedom', 'Justice', 'Courage',
        'Wisdom', 'Peace', 'Hope', 'Faith', 'Love'
      ]
    };

    this.categories = Object.keys(this.words);
  }

  getRandomWord() {
    const category = this.categories[Math.floor(Math.random() * this.categories.length)];
    const wordsInCategory = this.words[category];
    const word = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
    
    return { word, category };
  }

  getWordByCategory(category) {
    if (!this.words[category]) {
      return this.getRandomWord();
    }
    
    const wordsInCategory = this.words[category];
    const word = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
    
    return { word, category };
  }
}
