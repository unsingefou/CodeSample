require 'activeresource_apartment_tools'

class HotelPrototype < ContextedActiveResource
  self.site = "lvh.me:3000"
  self.collection_parser = PaginatedResource
end
