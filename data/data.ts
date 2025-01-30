import { Event } from '@/types/event'; 

export const eventData: Event[] = [
  {
    id: '1',
    event_name: 'Un parfait inconnu',
    creation_date: new Date('2025-01-28T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-07-01T00:00:00'),
        end_day: new Date('2025-07-15T23:59:59'),
        locations: [
          {
            location: 'Carthage Amphitheatre, Tunis',
            times: [
              {
                start_time: new Date('2025-07-01T20:00:00'),
                end_time: new Date('2025-07-01T23:00:00'),
                tickets: [
                  { ticket_id: 't1', type: 'Solo', count: 200, price: 60 },
                  { ticket_id: 't2', type: 'VIP', count: 50, price: 150 }
                ],
              }
            ]
          }
        ]
      },
      {
        start_day: new Date('2025-08-01T00:00:00'),
        end_day: new Date('2025-08-10T23:59:59'),
        locations: [
          {
            location: 'Carthage Amphitheatre, Tunis',
            times: [
              {
                start_time: new Date('2025-08-01T21:00:00'),
                end_time: new Date('2025-08-01T23:30:00'),
                tickets: [
                  { ticket_id: 't5', type: 'Solo', count: 150, price: 70 },
                  { ticket_id: 't6', type: 'VIP', count: 30, price: 180 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Experience the grandeur of the annual **Festival International de Carthage**, one of Tunisia’s most iconic cultural events, featuring world-class performances.',
    sponsored: true,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2Fbb1a6b910d7baafda1649bc53dfb73206.jpg&w=640&q=75','https://media.pathe.tn/movie/mx/43294/lg/34/media'],
    views: 3000,
    purchased_tickets: 'ticket_data_id_1',
    likes: ['user1', 'user2', 'user3'],
    comments: ['comment1', 'comment2'],
    owner: 'organizer1',
    isValid: true,
    categories: ['Cinema', 'Festival'],
    paymentMethods: ['Online'],
    globalTickets: [{ ticket: 'global_ticket_id_1', discount: 10 }],
    delivery_threshold: 50,
  },
  {
    id: '2',
    event_name: 'Sahbek Rajel / صاحبك راجل',
    creation_date: new Date('2025-01-28T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-06-10T00:00:00'),
        end_day: new Date('2025-06-12T23:59:59'),
        locations: [
          {
            location: 'Medina of Tunis',
            times: [
              {
                start_time: new Date('2025-06-10T09:00:00'),
                end_time: new Date('2025-06-10T18:00:00'),
                tickets: [{ ticket_id: 't4', type: 'Solo', count: 100, price: 40 }]
              },
              {
                start_time: new Date('2025-06-11T09:00:00'),
                end_time: new Date('2025-06-11T18:00:00'),
                tickets: [{ ticket_id: 't5', type: 'Family', count: 50, price: 100 }]
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Discover the historic charm of the **Festival de la Médina de Tunis**, a celebration of traditional Tunisian music and crafts.',
    sponsored: false,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2Fb83af033bb105dd6832d8dbbd761a589f.jpg&w=640&q=75','https://media.pathe.tn/movie/id/43544/backdrop/183947/lg/1/capture.PNG'],
    views: 1500,
    likes: ['user4', 'user5'],
    comments: ['comment3', 'comment4'],
    owner: 'organizer2',
    isValid: true,
    categories: ['Cultural', 'Caritatif'],
    paymentMethods: ['Online', 'Delivery'],
    globalTickets: [
      { ticket: 'global_ticket_id_2', discount: 15 }
    ]
  },
  {
    id: '3',
    event_name: 'La maison dorée / النافورة',
    creation_date: new Date('2025-01-28T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-05-25T00:00:00'),
        end_day: new Date('2025-05-29T23:59:59'),
        locations: [
          {
            location: 'Carthage Amphitheatre, Tunis',
            times: [
              {
                start_time: new Date('2025-05-25T19:00:00'),
                end_time: new Date('2025-05-25T22:00:00'),
                tickets: [
                  { ticket_id: 't7', type: 'Solo', count: 150, price: 80 },
                  { ticket_id: 't8', type: 'Family', count: 30, price: 120 }
                ],
              },
              {
                start_time: new Date('2025-05-26T19:00:00'),
                end_time: new Date('2025-05-26T22:00:00'),
                tickets: [{ ticket_id: 't9', type: 'Solo', count: 100, price: 100 }]
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Join the **Journées Musicales de Carthage**, where artists from around the world perform in the beautiful Carthage Amphitheatre.',
    sponsored: true,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2F18e9188264db81976572554c4093cbd6.jpg&w=640&q=75'],
    views: 2500,
    likes: ['user6', 'user7'],
    comments: ['comment5', 'comment6'],
    owner: 'organizer3',
    isValid: true,
    categories: ['Music', 'Concerts'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_3', discount: 5 }
    ]
  },
  {
    id: '4',
    event_name: 'Sing Sing',
    creation_date: new Date('2025-02-01T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-03-20T00:00:00'),
        end_day: new Date('2025-03-20T23:59:59'),
        locations: [
          {
            location: 'Habib Bourguiba Avenue, Tunis',
            times: [
              {
                start_time: new Date('2025-03-20T18:00:00'),
                end_time: new Date('2025-03-20T22:00:00'),
                tickets: [
                  { ticket_id: 't10', type: 'Solo', count: 200, price: 50 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Celebrate **Fête de la Musique Tunisienne** with live performances from the best local musicians in the heart of Tunis!',
    sponsored: false,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2Fbe41a2c1f6710f1ed1ccb73526ec66f23.png&w=640&q=75'],
    views: 1200,
    likes: ['user8', 'user9'],
    comments: ['comment7', 'comment8'],
    owner: 'organizer4',
    isValid: true,
    categories: ['Music', 'Parties'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_4', discount: 20 }
    ]
  },
  {
    id: '5',
    event_name: 'Companion',
    creation_date: new Date('2025-02-01T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-04-05T00:00:00'),
        end_day: new Date('2025-04-08T23:59:59'),
        locations: [
          {
            location: 'La Maison de la Culture, Tunis',
            times: [
              {
                start_time: new Date('2025-04-05T19:00:00'),
                end_time: new Date('2025-04-05T22:00:00'),
                tickets: [
                  { ticket_id: 't11', type: 'Solo', count: 150, price: 100 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Private',
    description: 'Join us for **Tunis Fashion Week**, where top designers showcase their latest collections in a stunning cultural setting.',
    sponsored: true,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2F2f76b4f713472fa99178f8e6f9aee027.jpg&w=640&q=75'],
    views: 2000,
    likes: ['user10', 'user11'],
    comments: ['comment9', 'comment10'],
    owner: 'organizer5',
    isValid: true,
    categories: ['Fashion', 'Entertainment'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_5', discount: 25 }
    ]
  },
  {
    id: '6',
    event_name: 'Le pont / قنطرة',
    creation_date: new Date('2025-02-01T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-10-10T00:00:00'),
        end_day: new Date('2025-10-15T23:59:59'),
        locations: [
          {
            location: 'Cinematheque de Tunis',
            times: [
              {
                start_time: new Date('2025-10-10T18:00:00'),
                end_time: new Date('2025-10-10T21:00:00'),
                tickets: [
                  { ticket_id: 't12', type: 'Solo', count: 120, price: 70 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Celebrate the best of cinema at the **Festival du Film de Tunis**, featuring screenings of national and international films.',
    sponsored: false,
    thumbnail: ['https://media.pathe.tn/movie/alex/HO00000640/poster/md/1/movie&uuid=DE963EBF-A9CF-4B14-95EF-CE712E9DF76D'],
    views: 1800,
    likes: ['user12', 'user13'],
    comments: ['comment11', 'comment12'],
    owner: 'organizer6',
    isValid: true,
    categories: ['Film', 'Cinema'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_6', discount: 15 }
    ]
  },
  {
    id: '7',
    event_name: 'International Trade Fair of Tunis ',
    creation_date: new Date('2025-02-01T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-05-01T00:00:00'),
        end_day: new Date('2025-05-05T23:59:59'),
        locations: [
          {
            location: 'Tunis International Exhibition Centre',
            times: [
              {
                start_time: new Date('2025-05-01T10:00:00'),
                end_time: new Date('2025-05-01T18:00:00'),
                tickets: [
                  { ticket_id: 't13', type: 'Business', count: 50, price: 200 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Join the **International Trade Fair of Tunis**, where business professionals meet to showcase innovations and establish partnerships.',
    sponsored: true,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2F2fa4cc29b103e909cb58f10867d5db7cd5.jpeg&w=640&q=75'],
    views: 2200,
    likes: ['user14', 'user15'],
    comments: ['comment13', 'comment14'],
    owner: 'organizer7',
    isValid: true,
    categories: ['Business', 'Congrets'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_7', discount: 10 }
    ]
  },
  {
    id: '8',
    event_name: 'Sousse International Kite Festival ',
    creation_date: new Date('2025-02-01T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-06-25T00:00:00'),
        end_day: new Date('2025-06-27T23:59:59'),
        locations: [
          {
            location: 'Sousse Beach',
            times: [
              {
                start_time: new Date('2025-06-25T10:00:00'),
                end_time: new Date('2025-06-25T18:00:00'),
                tickets: [
                  { ticket_id: 't14', type: 'Solo', count: 100, price: 30 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Fly high at the **Sousse International Kite Festival**, where kite enthusiasts come together for a colorful and exciting event.',
    sponsored: false,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2F9a6aa21b2776415b1f2eb5e3e53e8185.jpg&w=640&q=75'],
    views: 1700,
    likes: ['user16', 'user17'],
    comments: ['comment15', 'comment16'],
    owner: 'organizer8',
    isValid: true,
    categories: ['Sports', 'Excrusions'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_8', discount: 15 }
    ]
  },
  {
    id: '9',
    event_name: 'Tunisia International Jazz Festival',
    creation_date: new Date('2025-02-01T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-06-15T00:00:00'),
        end_day: new Date('2025-06-19T23:59:59'),
        locations: [
          {
            location: 'Tunis Jazz Hall',
            times: [
              {
                start_time: new Date('2025-06-15T18:00:00'),
                end_time: new Date('2025-06-15T22:00:00'),
                tickets: [
                  { ticket_id: 't15', type: 'Solo', count: 200, price: 50 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Enjoy soulful music at the **Tunisia International Jazz Festival**, featuring top jazz artists from around the world.',
    sponsored: false,
    thumbnail: ['https://media.pathe.tn/movie/alex/HO00000611/poster/md/44/movie&uuid=C54BFFEE-0484-449D-906A-7C7DF75E9767'],
    views: 1900,
    likes: ['user18', 'user19'],
    comments: ['comment17', 'comment18'],
    owner: 'organizer9',
    isValid: true,
    categories: ['Music', 'Concerts'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_9', discount: 20 }
    ]
  },
  {
    id: '10',
    event_name: 'Bardo Museum Night',
    creation_date: new Date('2025-02-01T00:00:00'),
    periods: [
      {
        start_day: new Date('2025-08-15T00:00:00'),
        end_day: new Date('2025-08-15T23:59:59'),
        locations: [
          {
            location: 'Bardo Museum, Tunis',
            times: [
              {
                start_time: new Date('2025-08-15T19:00:00'),
                end_time: new Date('2025-08-15T23:00:00'),
                tickets: [
                  { ticket_id: 't16', type: 'Solo', count: 150, price: 60 }
                ],
              }
            ]
          }
        ]
      }
    ],
    visibility: 'Public',
    description: 'Experience the **Bardo Museum Night**, where the museum opens its doors at night for an immersive cultural experience.',
    sponsored: true,
    thumbnail: ['https://tunis.events/_next/image?url=https%3A%2F%2Fapi.tunis.events%2Fstorage%2Fe9dd91c5ad8582479f2103f1adeabdb101.jpeg&w=828&q=75'],
    views: 1600,
    likes: ['user20', 'user21'],
    comments: ['comment19', 'comment20'],
    owner: 'organizer10',
    isValid: true,
    categories: ['Cultural', 'Caritatif'],
    paymentMethods: ['Online'],
    globalTickets: [
      { ticket: 'global_ticket_id_10', discount: 5 }
    ]
  }
];