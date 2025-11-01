'use client';

import { motion } from 'framer-motion';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <ArrowsPointingOutIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Size Guide</h1>
          <p className="text-gray-600">Find your perfect fit with our comprehensive size charts</p>
        </motion.div>

        <div className="space-y-8">
          {/* Men's Clothing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-900 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Men's Clothing</h2>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">T-Shirts & Shirts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Chest (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Length (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">S</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">27</td>
                      <td className="px-4 py-3">16.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">M</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">28</td>
                      <td className="px-4 py-3">17.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">L</td>
                      <td className="px-4 py-3">40-42</td>
                      <td className="px-4 py-3">29</td>
                      <td className="px-4 py-3">18.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">XL</td>
                      <td className="px-4 py-3">42-44</td>
                      <td className="px-4 py-3">30</td>
                      <td className="px-4 py-3">19.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">XXL</td>
                      <td className="px-4 py-3">44-46</td>
                      <td className="px-4 py-3">31</td>
                      <td className="px-4 py-3">20.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4 mt-6">Pants & Jeans</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Waist (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Hip (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Inseam (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">28</td>
                      <td className="px-4 py-3">28-29</td>
                      <td className="px-4 py-3">36-37</td>
                      <td className="px-4 py-3">30</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">30</td>
                      <td className="px-4 py-3">30-31</td>
                      <td className="px-4 py-3">38-39</td>
                      <td className="px-4 py-3">32</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">32</td>
                      <td className="px-4 py-3">32-33</td>
                      <td className="px-4 py-3">40-41</td>
                      <td className="px-4 py-3">32</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">34</td>
                      <td className="px-4 py-3">34-35</td>
                      <td className="px-4 py-3">42-43</td>
                      <td className="px-4 py-3">34</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">36</td>
                      <td className="px-4 py-3">36-37</td>
                      <td className="px-4 py-3">44-45</td>
                      <td className="px-4 py-3">34</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Women's Clothing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-900 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Women's Clothing</h2>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tops & Dresses</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Bust (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Waist (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Hip (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">XS</td>
                      <td className="px-4 py-3">30-32</td>
                      <td className="px-4 py-3">24-26</td>
                      <td className="px-4 py-3">34-36</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">S</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">26-28</td>
                      <td className="px-4 py-3">36-38</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">M</td>
                      <td className="px-4 py-3">34-36</td>
                      <td className="px-4 py-3">28-30</td>
                      <td className="px-4 py-3">38-40</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">L</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">30-32</td>
                      <td className="px-4 py-3">40-42</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">XL</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">42-44</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Kids Clothing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-900 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Kids Clothing</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Age</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Height (inches)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Chest (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">2-3Y</td>
                      <td className="px-4 py-3">2-3 Years</td>
                      <td className="px-4 py-3">35-38</td>
                      <td className="px-4 py-3">20-21</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">4-5Y</td>
                      <td className="px-4 py-3">4-5 Years</td>
                      <td className="px-4 py-3">41-44</td>
                      <td className="px-4 py-3">22-23</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">6-7Y</td>
                      <td className="px-4 py-3">6-7 Years</td>
                      <td className="px-4 py-3">47-50</td>
                      <td className="px-4 py-3">24-25</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">8-9Y</td>
                      <td className="px-4 py-3">8-9 Years</td>
                      <td className="px-4 py-3">53-56</td>
                      <td className="px-4 py-3">26-27</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">10-11Y</td>
                      <td className="px-4 py-3">10-11 Years</td>
                      <td className="px-4 py-3">59-62</td>
                      <td className="px-4 py-3">28-29</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* How to Measure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">How to Measure</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Chest/Bust:</p>
                <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Waist:</p>
                <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Hip:</p>
                <p>Measure around the fullest part of your hips, keeping the tape horizontal.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Inseam:</p>
                <p>Measure from the crotch to the bottom of the ankle along the inside of the leg.</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> If you're between sizes, we recommend sizing up for a more comfortable fit. 
                Still unsure? Contact our customer service team for personalized assistance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
