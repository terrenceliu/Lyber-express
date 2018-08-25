const LyftPrice = {
    'lyft': {
        'base_fare': 1.00,
        'cost_mile': 0.93,
        'cost_min': 0.11,
        'min_fare': 3.05,
        'service_fee': 2.90
    },
    'lyft_plus': {
        'base_fare': 2.00,
        'cost_mile': 1.81,
        'cost_min': 0.25,
        'min_fare': 6.00,
        'service_fee': 3.00
    },
    'lyft_premier': {
        'base_fare': 4.00,
        'cost_mile': 2.31,
        'cost_min': 0.30,
        'min_fare': 9.00,
        'service_fee': 3.00
    },
    'lyft_lux': {
        'base_fare': 7.00,
        'cost_mile': 3.51,
        'cost_min': 0.35,
        'min_fare': 15.00,
        'service_fee': 2.30
    },
    'lyft_luxsuv': {
        'base_fare': 14.00,
        'cost_mile': 4.06,
        'cost_min': 0.45,
        'min_fare': 25.00,
        'service_fee': 2.30

    }
};

module.exports = LyftPrice;